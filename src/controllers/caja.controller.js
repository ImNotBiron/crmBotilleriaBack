import pool from "../config/db.js";

// 1. ABRIR CAJA
export const abrirCaja = async (req, res, next) => {
  try {
    const { monto_inicial, id_usuario } = req.body;

    // Verificar si ya hay una abierta
    const [activas] = await pool.query("SELECT id FROM caja_sesiones WHERE estado = 'abierta'");
    if (activas.length > 0) {
      return res.status(400).json({ message: "Ya existe una caja abierta." });
    }

    await pool.query(
      "INSERT INTO caja_sesiones (monto_inicial, id_usuario, fecha_apertura) VALUES (?, ?, NOW())",
      [monto_inicial, id_usuario]
    );

    res.json({ success: true, message: "Caja abierta correctamente." });
  } catch (error) {
    next(error);
  }
};

// 2. OBTENER ESTADO ACTUAL (Para el Dashboard)
export const getEstadoCaja = async (req, res, next) => {
  try {
    // Buscar sesión abierta
    const [sesion] = await pool.query("SELECT * FROM caja_sesiones WHERE estado = 'abierta' LIMIT 1");
    
    if (sesion.length === 0) {
      return res.json({ estado: "cerrada" }); // No hay caja abierta
    }

    const caja = sesion[0];

    // Calcular ventas desde la fecha de apertura hasta AHORA
    // Sumamos agrupado por tipo de pago
    const [ventas] = await pool.query(
      `
      SELECT 
        vp.tipo_pago, 
        COALESCE(SUM(vp.monto), 0) as total
      FROM ventas_pagos vp
      JOIN ventas v ON vp.id_venta = v.id
      WHERE v.fecha >= ? 
      GROUP BY vp.tipo_pago
      `,
      [caja.fecha_apertura]
    );

    // Procesar totales
    let totalEfectivo = 0;
    let totalDigital = 0;

    ventas.forEach(v => {
      if (v.tipo_pago === 'EFECTIVO' || v.tipo_pago === 'GIRO') {
        totalEfectivo += Number(v.total);
      } else {
        totalDigital += Number(v.total);
      }
    });

    // Resultado para el Front
    res.json({
      estado: "abierta",
      datos: {
        id: caja.id,
        fecha_apertura: caja.fecha_apertura,
        monto_inicial: caja.monto_inicial,
        ventas_efectivo: totalEfectivo,
        ventas_digital: totalDigital,
        // Lo que debería haber en el cajón: Fondo + Ventas Efectivo
        total_esperado_cajon: caja.monto_inicial + totalEfectivo 
      }
    });

  } catch (error) {
    next(error);
  }
};

// 3. CERRAR CAJA
export const cerrarCaja = async (req, res, next) => {
  try {
    const { id_caja, monto_final_real, totales_sistema } = req.body;

    // Calculamos diferencia: Lo que contó el admin - (Inicial + Ventas Efectivo Sistema)
    // Si da negativo, falta plata. Si da positivo, sobra.
    const esperado = totales_sistema.monto_inicial + totales_sistema.ventas_efectivo;
    const diferencia = monto_final_real - esperado;

    await pool.query(
      `UPDATE caja_sesiones SET 
        fecha_cierre = NOW(), 
        total_ventas_efectivo = ?, 
        total_ventas_digital = ?, 
        monto_final_real = ?, 
        diferencia = ?, 
        estado = 'cerrada' 
       WHERE id = ?`,
      [
        totales_sistema.ventas_efectivo,
        totales_sistema.ventas_digital,
        monto_final_real,
        diferencia,
        id_caja
      ]
    );

    res.json({ success: true, message: "Caja cerrada correctamente." });

  } catch (error) {
    next(error);
  }
};