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
  } = req.body;

  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    // A) Insertar venta
    const [ventaRes] = await conn.query(
      `INSERT INTO ventas (total_general, total_afecto, total_exento, fecha, id_usuario)
       VALUES (?, ?, ?, NOW(), ?)`,
      [total_general, total_afecto, total_exento, id_usuario]
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
      const { id_producto, cantidad, precio_unitario, exento_iva } = item;

      await conn.query(
        `INSERT INTO ventas_detalles (id_venta, id_producto, cantidad, precio_unitario, exento_iva)
         VALUES (?, ?, ?, ?, ?)`,
        [idVenta, id_producto, cantidad, precio_unitario, exento_iva]
      );

      await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`,
        [cantidad, id_producto]
      );
      
      // Opcional: Lógica de alertas de stock aquí...
    }

    // D) Guardar Voucher (JSON)
    const contenidoVoucher = JSON.stringify({
       empresa: "Botillería CRM",
       fecha: new Date(),
       vendedor_id: id_usuario,
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

// ✅ 2. OBTENER HISTORIAL (LA FUNCIÓN QUE FALTABA)
export const getHistorialVentas = async (req, res, next) => {
  try {
    const { fechaInicio, fechaFin } = req.query;

    let sql = `
      SELECT 
        v.id,
        v.fecha,
        v.total_general,
        u.nombre_usuario AS vendedor,
        -- Concatenamos los medios de pago (Ej: "EFECTIVO, DEBITO")
        (SELECT GROUP_CONCAT(tipo_pago SEPARATOR ', ') FROM ventas_pagos WHERE id_venta = v.id) as formas_pago,
        -- Traemos el voucher para reimprimir
        vouch.contenido AS json_voucher
      FROM ventas v
      LEFT JOIN usuarios u ON v.id_usuario = u.id
      LEFT JOIN vouchers vouch ON v.id = vouch.id_venta
    `;

    const params = [];

    // Filtro por fechas
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
// ... (imports y funciones anteriores crearVenta y getHistorialVentas se mantienen igual) ...

// ✅ 3. RESUMEN VENDEDORES (DASHBOARD)
export const getResumenVendedores = async (req, res, next) => {
  try {
    // 1. Buscamos la caja abierta para saber desde qué hora contar
    const [caja] = await pool.query("SELECT fecha_apertura FROM caja_sesiones WHERE estado = 'abierta' LIMIT 1");
    
    const fechaInicio = caja.length > 0 ? caja[0].fecha_apertura : null;

    // 2. Traemos usuarios vendedores y sumamos sus ventas DESDE la apertura
    // Si la caja está cerrada, fechaInicio es null, así que traerá ventas históricas o 0 según lógica.
    // Para evitar confusiones, si caja cerrada -> ventas 0.
    
    let sql = `
      SELECT 
        u.id, 
        u.nombre_usuario, 
        u.activo,
        COALESCE(SUM(v.total_general), 0) as total_vendido,
        COUNT(v.id) as cantidad_ventas,
        MAX(v.id) as last_venta_id
      FROM usuarios u
      LEFT JOIN ventas v ON u.id = v.id_usuario ${fechaInicio ? 'AND v.fecha >= ?' : 'AND 1=0'} 
      WHERE u.tipo_usuario = 'vendedor' AND u.activo = 1
      GROUP BY u.id
    `;

    const params = fechaInicio ? [fechaInicio] : [];
    const [rows] = await pool.query(sql, params);

    res.json({
        caja_abierta: !!fechaInicio,
        vendedores: rows
    });

  } catch (error) {
    next(error);
  }
};

// ✅ 4. OBTENER VENTA POR ID (PARA REIMPRIMIR DESDE DASHBOARD)
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