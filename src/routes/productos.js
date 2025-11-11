import express from "express";
import db from "../db.js";

const router = express.Router();

// Obtener todos los productos o buscar por query
router.get("/", async (req, res) => {
  try {
    const { q } = req.query; // query para buscar
    let sql = "SELECT * FROM productos";
    const params = [];

    if (q) {
      sql += " WHERE codigo_producto LIKE ? OR nombre_producto LIKE ?";
      params.push(`%${q}%`, `%${q}%`);
    }

    const [rows] = await db.query(sql, params);
    res.json(rows);
    console.log(rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener productos" });
  }
});

export default router;
