// src/controllers/usuarios.controller.js
import pool from "../config/db.js";
import { normalizarRut } from "../utils/rut.js";

// GET /usuarios
export const getUsuarios = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        id,
        nombre_usuario,
        rut_usuario,
        tipo_usuario,
        activo,
        created_at
      FROM usuarios
      ORDER BY id ASC
      `
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /usuarios/:id
export const getUsuarioById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        nombre_usuario,
        rut_usuario,
        tipo_usuario,
        activo,
        created_at
      FROM usuarios
      WHERE id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /usuarios
export const createUsuario = async (req, res, next) => {
  try {
    const { nombre_usuario, rut_usuario, tipo_usuario = "vendedor" } = req.body;

    if (!nombre_usuario || !rut_usuario) {
      return res
        .status(400)
        .json({ message: "Nombre y RUT son obligatorios." });
    }

    const rut = normalizarRut(rut_usuario);

    const [exists] = await pool.query(
      "SELECT id FROM usuarios WHERE rut_usuario = ?",
      [rut]
    );

    if (exists.length > 0) {
      return res
        .status(409)
        .json({ message: "Ya existe un usuario con ese RUT." });
    }

    const [result] = await pool.query(
      `
      INSERT INTO usuarios (nombre_usuario, rut_usuario, tipo_usuario, activo)
      VALUES (?, ?, ?, 1)
      `,
      [nombre_usuario, rut, tipo_usuario]
    );

    res.json({ message: "Usuario creado.", id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// PUT /usuarios/:id
export const updateUsuario = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, rut_usuario } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    if (user.tipo_usuario === "admin") {
      return res
        .status(403)
        .json({ message: "El usuario admin no puede ser editado." });
    }

    const rut = normalizarRut(rut_usuario);

    const [dupe] = await pool.query(
      "SELECT id FROM usuarios WHERE rut_usuario = ? AND id != ?",
      [rut, id]
    );
    if (dupe.length > 0) {
      return res
        .status(409)
        .json({ message: "Ya existe otro usuario con ese RUT." });
    }

    await pool.query(
      `
      UPDATE usuarios 
      SET nombre_usuario = ?, rut_usuario = ?
      WHERE id = ?
      `,
      [nombre_usuario, rut, id]
    );

    res.json({ message: "Usuario actualizado." });
  } catch (error) {
    next(error);
  }
};

// PATCH /usuarios/:id/estado
export const updateUsuarioEstado = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM usuarios WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    if (user.tipo_usuario === "admin") {
      return res
        .status(403)
        .json({ message: "El admin no puede ser desactivado." });
    }

    await pool.query(
      "UPDATE usuarios SET activo = ? WHERE id = ?",
      [activo, id]
    );

    res.json({ message: "Estado actualizado." });
  } catch (error) {
    next(error);
  }
};
