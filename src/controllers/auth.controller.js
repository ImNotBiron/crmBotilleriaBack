// src/controllers/auth.controller.js
import pool from "../config/db.js";
import jwt from "jsonwebtoken";
import { limpiarRutFormato } from "../utils/rut.js";

export const login = async (req, res, next) => {
  try {
    const { rut } = req.body;

    if (!rut) {
      return res.status(400).json({ message: "Debe ingresar un RUT." });
    }

    const rutLimpio = limpiarRutFormato(rut);

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        nombre_usuario,
        rut_usuario,
        tipo_usuario,
        activo
      FROM usuarios
      WHERE REPLACE(REPLACE(rut_usuario, '-', ''), '.', '') = ?
      LIMIT 1
      `,
      [rutLimpio]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    if (!user.activo) {
      return res.status(403).json({ message: "Usuario desactivado." });
    }

    const payload = {
      id: user.id,
      rut: user.rut_usuario,
      tipo_usuario: user.tipo_usuario,
    };

    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret123",
      { expiresIn: "2h" }
    );

    res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre_usuario: user.nombre_usuario,
        rut_usuario: user.rut_usuario,
        tipo_usuario: user.tipo_usuario,
        activo: user.activo,
      },
    });
  } catch (error) {
    next(error);
  }
};
