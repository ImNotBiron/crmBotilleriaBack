import express from "express";
import pool from "../db.js";

const router = express.Router();

// 🟢 Listar todos los productos
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    console.error("Error al listar productos:", error);
    res.status(500).json({ error: "Error al listar productos" });
  }
});


// 🟣 Obtener producto por código de barras (NUEVO ENDPOINT)
router.get("/codigo/:codigo_producto", async (req, res) => {
  try {
    const codigo = req.params.codigo_producto;

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE codigo_producto = ? LIMIT 1",
      [codigo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]); // 👈 debe enviar un objeto, no un array
  } catch (error) {
    console.error("Error al buscar producto por código:", error);
    res.status(500).json({ error: "Error al buscar producto" });
  }
});


// 🟢 Obtener producto por ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos WHERE id = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: "Producto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener producto:", error);
    res.status(500).json({ error: "Error al obtener producto" });
  }
});


// 🟢 Crear nuevo producto
router.post("/", async (req, res) => {
  const { codigo_producto, nombre_producto, precio_producto, exento_iva, categoria_producto, distribuidora_producto } = req.body;
  try {
    await pool.query(
      `INSERT INTO productos (codigo_producto, nombre_producto, precio_producto, exento_iva, categoria_producto, distribuidora_producto)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [codigo_producto, nombre_producto, precio_producto, exento_iva, categoria_producto, distribuidora_producto]
    );
    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    console.error("Error al agregar producto:", error);
    res.status(500).json({ error: "Error al agregar producto" });
  }
});


// 🟡 Editar producto
router.put("/:id", async (req, res) => {
  const { codigo_producto, nombre_producto, precio_producto, exento_iva, categoria_producto, distribuidora_producto } = req.body;
  try {
    await pool.query(
      `UPDATE productos SET codigo_producto=?, nombre_producto=?, precio_producto=?, exento_iva=?, categoria_producto=?, distribuidora_producto=? WHERE id=?`,
      [codigo_producto, nombre_producto, precio_producto, exento_iva, categoria_producto, distribuidora_producto, req.params.id]
    );
    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ error: "Error al actualizar producto" });
  }
});


// 🔴 Eliminar producto
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM productos WHERE id=?", [req.params.id]);
    res.json({ message: "Producto eliminado" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error al eliminar producto" });
  }
});

export default router;
