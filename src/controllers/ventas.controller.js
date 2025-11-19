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

    // 1) Insertar venta
    const [ventaRes] = await conn.query(
      `
      INSERT INTO ventas (total_general, total_afecto, total_exento, fecha, id_usuario)
      VALUES (?, ?, ?, NOW(), ?)
      `,
      [total_general, total_afecto, total_exento, id_usuario]
    );

    const idVenta = ventaRes.insertId;

    // 2) Insertar pagos
    for (const p of pagos) {
      await conn.query(
        `
        INSERT INTO ventas_pagos (id_venta, tipo_pago, monto)
        VALUES (?, ?, ?)
        `,
        [idVenta, p.tipo, p.monto]
      );
    }

    // 3) Insertar detalles + descontar stock + historial + alertas
    for (const item of items) {
      const {
        id_producto,
        cantidad,
        precio_unitario,
        exento_iva,
      } = item;

      // detalle
      await conn.query(
        `
        INSERT INTO ventas_detalles
        (id_venta, id_producto, cantidad, precio_unitario, exento_iva)
        VALUES (?, ?, ?, ?, ?)
        `,
        [idVenta, id_producto, cantidad, precio_unitario, exento_iva]
      );

      // descontar stock
      await conn.query(
        `
        UPDATE productos 
        SET stock = stock - ?
        WHERE id = ?
        `,
        [cantidad, id_producto]
      );

      // obtener stock actual y mínimo
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

        // historial_stock
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

        // alerta de stock crítico
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
