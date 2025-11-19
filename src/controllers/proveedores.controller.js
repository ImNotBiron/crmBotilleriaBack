import pool from "../config/db.js";

// GET /proveedores
export const getProveedores = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre,
        telefono,
        email,
        direccion,
        created_at
      FROM proveedores
      ORDER BY nombre ASC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /proveedores/:id
export const getProveedorById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        id,
        nombre,
        telefono,
        email,
        direccion,
        created_at
      FROM proveedores
      WHERE id = ?
      `,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /proveedores
export const createProveedor = async (req, res, next) => {
  try {
    const { nombre, telefono, email, direccion } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    await pool.query(
      `
      INSERT INTO proveedores (nombre, telefono, email, direccion)
      VALUES (?, ?, ?, ?)
      `,
      [nombre, telefono, email, direccion]
    );

    res.json({ message: "Proveedor creado correctamente." });
  } catch (error) {
    next(error);
  }
};

// PUT /proveedores/:id
export const updateProveedor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, email, direccion } = req.body;

    const [exists] = await pool.query(
      "SELECT id FROM proveedores WHERE id = ?",
      [id]
    );

    if (!exists.length) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }

    await pool.query(
      `
      UPDATE proveedores
      SET nombre = ?, telefono = ?, email = ?, direccion = ?
      WHERE id = ?
      `,
      [nombre, telefono, email, direccion, id]
    );

    res.json({ message: "Proveedor actualizado correctamente." });
  } catch (error) {
    next(error);
  }
};

// DELETE /proveedores/:id
export const deleteProveedor = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query(
      "SELECT id FROM proveedores WHERE id = ?",
      [id]
    );

    if (!exists.length) {
      return res.status(404).json({ message: "Proveedor no encontrado." });
    }

    await pool.query("DELETE FROM proveedores WHERE id = ?", [id]);

    res.json({ message: "Proveedor eliminado." });
  } catch (error) {
    next(error);
  }
};
