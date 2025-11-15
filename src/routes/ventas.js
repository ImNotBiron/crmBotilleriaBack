import express from "express";
import pool from "../db.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const {id_usuario, total_general, total_afecto, total_exento, pagos, items } = req.body;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // 1) Insertar venta
   const [ventaRes] = await conn.query(
  `INSERT INTO ventas (id_usuario, total_general, total_afecto, total_exento, fecha)
   VALUES (?, ?, ?, ?, NOW())`,
  [id_usuario, total_general, total_afecto, total_exento]
);


    const idVenta = ventaRes.insertId;

    // 2) Insertar pagos
    for (const p of pagos) {
      await conn.query(
        `INSERT INTO ventas_pagos (id_venta, tipo_pago, monto)
         VALUES (?, ?, ?)`,
        [idVenta, p.tipo, p.monto]
      );
    }

    // 3) Insertar detalles + descontar stock
    for (const item of items) {
      await conn.query(
        `INSERT INTO ventas_detalles
         (id_venta, id_producto, cantidad, precio_unitario, exento_iva)
         VALUES (?, ?, ?, ?, ?)`,
        [
          idVenta,
          item.id_producto,
          item.cantidad,
          item.precio_unitario,
          item.exento_iva,
        ]
      );

      // descontar stock
      await conn.query(
        `UPDATE productos SET stock = stock - ? WHERE id = ?`,
        [item.cantidad, item.id_producto]
      );
    }

    await conn.commit();

    res.json({ success: true, id_venta: idVenta });

  } catch (error) {
    await conn.rollback();
    console.error("Error al registrar venta:", error);
    res.status(500).json({ error: "Error al registrar venta" });
  } finally {
    conn.release();
  }
});

export default router;
