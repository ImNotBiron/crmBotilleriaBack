import pool from "../config/db.js";

// 1. CREAR VENTA (POS)
export const crearVenta = async (req, res, next) => {
  const {
    id_usuario,
    total_general,
    total_afecto,
    total_exento,
    pagos,
    items,
    tipo_venta = "NORMAL" // ✅ NUEVO CAMPO (Default NORMAL)
  } = req.body;

  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // A) Insertar venta CON TIPO
    // Nota: Si es INTERNA, asumimos que se marca como "boleteado" (1) para que no salga en la lista de pendientes del SII
    // o (0) si quieres declararla igual. Asumiré 1 para que no moleste.
    const [ventaRes] = await conn.query(
      `INSERT INTO ventas (total_general, total_afecto, total_exento, fecha, id_usuario, tipo_venta, boleteado)
       VALUES (?, ?, ?, NOW(), ?, ?, ?)`,
      [
        total_general, 
        total_afecto, 
        total_exento, 
        id_usuario, 
        tipo_venta, 
        tipo_venta === 'INTERNA' ? 1 : 0 
      ]
    );
    const idVenta = ventaRes.insertId;

    // B) Insertar pagos
    for (const p of pagos) {
      await conn.query(
        `INSERT INTO ventas_pagos (id_venta, tipo_pago, monto) VALUES (?, ?, ?)`,
        [idVenta, p.tipo, p.monto]
      );
    }

    // C) Insertar detalles y descontar stock
    for (const item of items) {
      const { id_producto, nombre_producto, cantidad, precio_unitario, exento_iva } = item;
      
      await conn.query(
        `INSERT INTO ventas_detalles (id_venta, id_producto, cantidad, precio_unitario, exento_iva)
         VALUES (?, ?, ?, ?, ?)`,
        [idVenta, id_producto, cantidad, precio_unitario, exento_iva]
      );

      await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`,
        [cantidad, id_producto]
      );
    }

    // D) Guardar Voucher (JSON) - Mantener igual
    const contenidoVoucher = JSON.stringify({
       empresa: "Botillería CRM",
       fecha: new Date(),
       vendedor_id: id_usuario,
       tipo: tipo_venta, // Guardamos el tipo
       items: items.map(i => ({ 
         id: i.id_producto,
         nombre_producto: i.nombre_producto,
         cantidad: i.cantidad, 
         precio: i.precio_unitario 
       })),
       total: total_general,
       pagos: pagos
    });

    await conn.query(
      `INSERT INTO vouchers (id_venta, folio_voucher, contenido) VALUES (?, ?, ?)`,
      [idVenta, idVenta, contenidoVoucher]
    );

    await conn.commit();
    res.json({ success: true, id_venta: idVenta });

  } catch (error) {
     if (conn) await conn.rollback();
     console.error("Error venta:", error);
     next(error);
  } finally {
     if (conn) conn.release();
  }
};
// 2. OBTENER HISTORIAL (CON FILTROS)
export const getHistorialVentas = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let sql = `
      SELECT 
        v.id,
        v.fecha,
        v.total_general,
        u.nombre_usuario AS vendedor,
        (SELECT GROUP_CONCAT(tipo_pago SEPARATOR ', ') FROM ventas_pagos WHERE id_venta = v.id) as formas_pago,
        vouch.contenido AS json_voucher
      FROM ventas v
      LEFT JOIN usuarios u ON v.id_usuario = u.id
      LEFT JOIN vouchers vouch ON v.id = vouch.id_venta
    `;

    const params = [];

    if (fechaInicio && fechaFin) {
      sql += ` WHERE DATE(v.fecha) BETWEEN ? AND ? `;
      params.push(fechaInicio, fechaFin);
    }

    sql += ` ORDER BY v.fecha DESC LIMIT 100`;

    const [rows] = await pool.query(sql, params);
    res.json(rows);

  } catch (error) {
    next(error);
  }
};

// ✅ 3. RESUMEN VENDEDORES (PARA EL DASHBOARD)
// Esta es la función que buscas.
export const getResumenVendedores = async (req, res, next) => {
  try {
    // 1. Buscamos la hora de apertura de la caja actual
    const [caja] = await pool.query("SELECT fecha_apertura FROM caja_sesiones WHERE estado = 'abierta' LIMIT 1");
    
    const fechaInicio = caja.length > 0 ? caja[0].fecha_apertura : null;

    // 2. Consulta Maestra: Vendedores + Ventas en este turno + Estado En Línea
    let sql = `
      SELECT 
        u.id, 
        u.nombre_usuario, 
        u.en_linea,  -- Importante: Estado de conexión real
        -- Sumamos ventas SOLO si ocurrieron después de abrir la caja
        COALESCE(SUM(CASE WHEN v.fecha >= ? THEN v.total_general ELSE 0 END), 0) as total_vendido,
        COUNT(CASE WHEN v.fecha >= ? THEN v.id END) as cantidad_ventas,
        MAX(v.id) as last_venta_id
      FROM usuarios u
      LEFT JOIN ventas v ON u.id = v.id_usuario
      WHERE u.tipo_usuario = 'vendedor' AND u.activo = 1
      GROUP BY u.id
      ORDER BY u.en_linea DESC, total_vendido DESC
    `;

    // Si no hay caja abierta, pasamos una fecha futura o null para que sume 0,
    // pero igual devolvemos la lista de vendedores para ver quién está conectado.
    // Truco: Si fechaInicio es null, usamos la fecha actual para que no sume nada histórico
    const paramFecha = fechaInicio || new Date(); 

    const [rows] = await pool.query(sql, [paramFecha, paramFecha]);

    res.json({
        caja_abierta: !!fechaInicio,
        vendedores: rows
    });

  } catch (error) {
    next(error);
  }
};

// 4. OBTENER VENTA POR ID
export const getVentaById = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const [rows] = await pool.query(`
            SELECT 
                v.id, v.fecha, v.total_general, 
                u.nombre_usuario AS vendedor,
                vouch.contenido AS json_voucher
            FROM ventas v
            LEFT JOIN usuarios u ON v.id_usuario = u.id
            LEFT JOIN vouchers vouch ON v.id = vouch.id_venta
            WHERE v.id = ?
        `, [id]);

        if (rows.length === 0) return res.status(404).json({ message: "Venta no encontrada" });
        res.json(rows[0]);

    } catch (error) {
        next(error);
    }
};


// ✅ 5. OBTENER VENTAS PENDIENTES DE BOLETEAR (Solo Efectivo)
export const getVentasPorBoletear = async (req, res, next) => {
  try {
    // Buscamos ventas donde el pago sea EFECTIVO y no estén boleteadas
    const [rows] = await pool.query(`
      SELECT 
        v.id, 
        v.fecha, 
        v.total_general, 
        u.nombre_usuario as vendedor
      FROM ventas v
      JOIN ventas_pagos vp ON v.id = vp.id_venta
      LEFT JOIN usuarios u ON v.id_usuario = u.id
      WHERE (vp.tipo_pago = 'EFECTIVO' OR vp.tipo_pago = 'GIRO')
        AND v.boleteado = 0
      GROUP BY v.id
      ORDER BY v.fecha DESC
    `);
    
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// . MARCAR VENTA COMO BOLETEADA
export const marcarBoleteado = async (req, res, next) => {
  try {
    const { id_venta } = req.body;
    
    await pool.query("UPDATE ventas SET boleteado = 1 WHERE id = ?", [id_venta]);
    
    res.json({ success: true, message: "Venta marcada como boleteada." });
  } catch (error) {
    next(error);
  }
};