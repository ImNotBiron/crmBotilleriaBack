import express from "express";
import pool from "../db.js";

const router = express.Router();

// Normalizar RUT
const normalizarRut = (rut = "") =>
  rut.replace(/[^\dkK]/g, "").toUpperCase();

// =============================================
// GET /usuarios → listar todos
// =============================================
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios ORDER BY id ASC");
    res.json(rows);
  } catch (error) {
    console.error("Error GET /usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios." });
  }
});

// =============================================
// GET /usuarios/:id → obtener uno
// =============================================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error GET /usuarios/:id:", error);
    res.status(500).json({ message: "Error al obtener usuario." });
  }
});

// =============================================
// POST /usuarios → crear vendedor
// =============================================
router.post("/", async (req, res) => {
  try {
    const { nombre_usuario, rut_usuario } = req.body;

    if (!nombre_usuario || !rut_usuario) {
      return res.status(400).json({ message: "Nombre y RUT son obligatorios." });
    }

    const rut = normalizarRut(rut_usuario);

    // Verificar duplicado
    const [exists] = await pool.query(
      "SELECT id FROM usuarios WHERE rut_usuario = ?",
      [rut]
    );

    if (exists.length > 0) {
      return res.status(409).json({ message: "Ya existe un usuario con ese RUT." });
    }

    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre_usuario, rut_usuario, tipo_usuario, activo) VALUES (?, ?, 'vendedor', 1)",
      [nombre_usuario, rut]
    );

    res.json({ message: "Usuario creado.", id: result.insertId });

  } catch (error) {
    console.error("Error POST /usuarios:", error);
    res.status(500).json({ message: "Error al crear usuario." });
  }
});

// =============================================
// PUT /usuarios/:id → editar usuario
// =============================================
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre_usuario, rut_usuario } = req.body;

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    // No se puede editar admin
    if (user.tipo_usuario === "admin") {
      return res.status(403).json({ message: "El usuario admin no puede ser editado." });
    }

    const rut = normalizarRut(rut_usuario);

    // Verificar RUT duplicado
    const [dupe] = await pool.query(
      "SELECT id FROM usuarios WHERE rut_usuario = ? AND id != ?",
      [rut, id]
    );
    if (dupe.length > 0) {
      return res.status(409).json({ message: "Ya existe otro usuario con ese RUT." });
    }

    await pool.query(
      "UPDATE usuarios SET nombre_usuario = ?, rut_usuario = ? WHERE id = ?",
      [nombre_usuario, rut, id]
    );

    res.json({ message: "Usuario actualizado." });

  } catch (error) {
    console.error("Error PUT /usuarios:", error);
    res.status(500).json({ message: "Error al actualizar usuario." });
  }
});

// =============================================
// PATCH /usuarios/:id/estado → activar/desactivar
// =============================================
router.patch("/:id/estado", async (req, res) => {
  try {
    const { id } = req.params;
    const { activo } = req.body;

    const [rows] = await pool.query("SELECT * FROM usuarios WHERE id = ?", [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Usuario no encontrado." });
    }

    const user = rows[0];

    // No desactivar admin
    if (user.tipo_usuario === "admin") {
      return res.status(403).json({ message: "El admin no puede ser desactivado." });
    }

    await pool.query("UPDATE usuarios SET activo = ? WHERE id = ?", [
      activo,
      id,
    ]);

    res.json({ message: "Estado actualizado." });

  } catch (error) {
    console.error("Error PATCH /usuarios/:id/estado:", error);
    res.status(500).json({ message: "Error al cambiar estado del usuario." });
  }
});

export default router;
