// src/controllers/ventas.controller.js
import pool from "../config/db.js";

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

    // =================================================================
    // 1) Insertar venta
    // =================================================================
    const [ventaRes] = await conn.query(
      `
      INSERT INTO ventas (total_general, total_afecto, total_exento, fecha, id_usuario)
      VALUES (?, ?, ?, NOW(), ?)
      `,
      [total_general, total_afecto, total_exento, id_usuario]
    );

    const idVenta = ventaRes.insertId;

    // =================================================================
    // 2) Insertar pagos
    // =================================================================
    for (const p of pagos) {
      await conn.query(
        `
        INSERT INTO ventas_pagos (id_venta, tipo_pago, monto)
        VALUES (?, ?, ?)
        `,
        [idVenta, p.tipo, p.monto]
      );
    }

    // =================================================================
    // 3) Insertar detalles + descontar stock + historial + alertas
    // =================================================================
    for (const item of items) {
      const {
        id_producto,
        cantidad,
        precio_unitario,
        exento_iva,
      } = item;

      // A. Detalle de venta
      await conn.query(
        `
        INSERT INTO ventas_detalles
        (id_venta, id_producto, cantidad, precio_unitario, exento_iva)
        VALUES (?, ?, ?, ?, ?)
        `,
        [idVenta, id_producto, cantidad, precio_unitario, exento_iva]
      );

      // B. Descontar stock
      await conn.query(
        `
        UPDATE productos 
        SET stock = stock - ?
        WHERE id = ?
        `,
        [cantidad, id_producto]
      );

      // C. Verificar alertas y guardar historial
      const [prodRows] = await conn.query(
        `
        SELECT stock, stock_minimo, nombre_producto
        FROM productos
        WHERE id = ?
        `,
        [id_producto]
      );

      if (prodRows.length) {
        const { stock, stock_minimo, nombre_producto } = prodRows[0];

        // Historial
        await conn.query(
          `
          INSERT INTO historial_stock
          (id_producto, tipo, cantidad, referencia, comentario)
          VALUES (?, 'venta', ?, ?, ?)
          `,
          [
            id_producto,
            cantidad,
            `VENTA:${idVenta}`,
            `Venta registrada por usuario ${id_usuario}`,
          ]
        );

        // Alerta de stock crítico
        if (stock_minimo > 0 && stock <= stock_minimo) {
          const mensaje = `Stock crítico del producto "${nombre_producto}" (ID ${id_producto}). Stock actual: ${stock}, mínimo: ${stock_minimo}.`;

          await conn.query(
            `
            INSERT INTO alertas_stock (id_producto, mensaje)
            VALUES (?, ?)
            `,
            [id_producto, mensaje]
          );
        }
      }
    }

    // =================================================================
    // 4) NUEVO: Generar y guardar Voucher
    // =================================================================
    
    // Creamos un JSON con los datos esenciales para reimpresión futura
    const contenidoVoucher = JSON.stringify({
       empresa: "Botillería CRM",
       fecha: new Date(),
       vendedor_id: id_usuario,
       items: items.map(i => ({ 
         id: i.id_producto, 
         cantidad: i.cantidad, 
         precio: i.precio_unitario 
       })),
       total: total_general,
       pagos: pagos
    });

    // Insertamos en la tabla vouchers
    // Nota: Usamos el idVenta como "folio_voucher" inicial
    await conn.query(
      `INSERT INTO vouchers (id_venta, folio_voucher, contenido) VALUES (?, ?, ?)`,
      [idVenta, idVenta, contenidoVoucher]
    );

    // =================================================================

    await conn.commit();

    res.json({ success: true, id_venta: idVenta });
  } catch (error) {
    if (conn) await conn.rollback();
    console.error("Error al registrar venta:", error);
    next(error);
  } finally {
    if (conn) conn.release();
  }
};
