import pool from "../config/db.js";

// 1. ABRIR CAJA
export const abrirCaja = async (req, res, next) => {
  try {
    const { monto_inicial, id_usuario } = req.body;

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

// ✅ 2. OBTENER ESTADO ACTUAL (CON HISTORIAL UNIFICADO)
export const getEstadoCaja = async (req, res, next) => {
  try {
    const [sesion] = await pool.query("SELECT * FROM caja_sesiones WHERE estado = 'abierta' LIMIT 1");
    
    if (sesion.length === 0) {
      return res.json({ estado: "cerrada" }); 
    }

    const caja = sesion[0];

    // A. Calcular Totales de VENTAS
    const [ventas] = await pool.query(
      `SELECT vp.tipo_pago, COALESCE(SUM(vp.monto), 0) as total
       FROM ventas_pagos vp
       JOIN ventas v ON vp.id_venta = v.id
       WHERE v.fecha >= ? GROUP BY vp.tipo_pago`,
      [caja.fecha_apertura]
    );

    let totalVentasEfectivo = 0;
    let totalVentasDigital = 0;

    ventas.forEach(v => {
      if (v.tipo_pago === 'EFECTIVO' || v.tipo_pago === 'GIRO') {
        totalVentasEfectivo += Number(v.total);
      } else {
        totalVentasDigital += Number(v.total);
      }
    });

    // B. Calcular MOVIMIENTOS Manuales
    const [movimientos] = await pool.query(
        `SELECT tipo, COALESCE(SUM(monto), 0) as total 
         FROM caja_movimientos 
         WHERE id_caja_sesion = ? 
         GROUP BY tipo`,
        [caja.id]
    );

    let totalIngresosExtra = 0;
    let totalEgresos = 0;

    movimientos.forEach(m => {
        if (m.tipo === 'INGRESO') totalIngresosExtra += Number(m.total);
        if (m.tipo === 'EGRESO') totalEgresos += Number(m.total);
    });

    // C. Calcular Total Esperado
    const totalEsperado = (caja.monto_inicial + totalVentasEfectivo + totalIngresosExtra) - totalEgresos;

    // ✅ D. GENERAR LISTA UNIFICADA (Ventas Efectivo + Movimientos Manuales)
    // Usamos UNION ALL para juntar ambas tablas en una sola lista cronológica
    const [listaUnificada] = await pool.query(
      `
      -- 1. Movimientos Manuales
      SELECT 
        cm.fecha, 
        cm.tipo, 
        cm.monto, 
        cm.comentario, 
        u.nombre_usuario 
      FROM caja_movimientos cm
      LEFT JOIN usuarios u ON cm.id_usuario = u.id
      WHERE cm.id_caja_sesion = ?

      UNION ALL

      -- 2. Ventas en Efectivo (Se muestran como 'VENTA')
      SELECT 
        v.fecha, 
        'VENTA' as tipo, 
        vp.monto, 
        CONCAT('Venta #', v.id) as comentario, 
        u.nombre_usuario
      FROM ventas v
      JOIN ventas_pagos vp ON v.id = vp.id_venta
      LEFT JOIN usuarios u ON v.id_usuario = u.id
      WHERE v.fecha >= ? AND (vp.tipo_pago = 'EFECTIVO' OR vp.tipo_pago = 'GIRO')

      ORDER BY fecha DESC
      LIMIT 50 -- Opcional: Limitar para no saturar si hay muchas ventas
      `,
      [caja.id, caja.fecha_apertura]
    );

    res.json({
      estado: "abierta",
      datos: {
        id: caja.id,
        fecha_apertura: caja.fecha_apertura,
        monto_inicial: caja.monto_inicial,
        ventas_efectivo: totalVentasEfectivo,
        ventas_digital: totalVentasDigital,
        ingresos_extra: totalIngresosExtra,
        egresos: totalEgresos,
        total_esperado_cajon: totalEsperado,
        lista_movimientos: listaUnificada // Ahora incluye ventas
      }
    });

  } catch (error) {
    next(error);
  }
};

// 3. REGISTRAR MOVIMIENTO
export const registrarMovimiento = async (req, res, next) => {
    try {
        const { id_caja, tipo, monto, comentario, id_usuario } = req.body;

        await pool.query(
            `INSERT INTO caja_movimientos (id_caja_sesion, tipo, monto, comentario, id_usuario)
             VALUES (?, ?, ?, ?, ?)`,
            [id_caja, tipo, monto, comentario, id_usuario]
        );

        res.json({ success: true, message: "Movimiento registrado." });
    } catch (error) {
        next(error);
    }
};

// 4. CERRAR CAJA
export const cerrarCaja = async (req, res, next) => {
  try {
    const { id_caja, monto_final_real, totales_sistema } = req.body;
    
    const esperado = totales_sistema.total_esperado_cajon;
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