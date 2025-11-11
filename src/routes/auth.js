import express from "express";
import db from "../db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", async (req, res) => {
  try {
    const { rut } = req.body;

    if (!rut) return res.status(400).json({ message: "Debe ingresar un RUT." });

    const [rows] = await db.query("SELECT * FROM usuarios WHERE rut_usuario = ?", [rut]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Usuario no encontrado." });

    const user = rows[0];

    const token = jwt.sign(
      { id: user.id_usuario, rut: user.rut_usuario, tipo_usuario: user.tipo_usuario },
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id_usuario: user.id_usuario,
        rut_usuario: user.rut_usuario,
        tipo_usuario: user.tipo_usuario
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error en el servidor." });
  }
});

export default router;

