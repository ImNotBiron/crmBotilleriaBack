import pool from "../config/db.js";

// GET /categorias
export const getCategorias = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre
      FROM categorias
      ORDER BY nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /categorias/:id
export const getCategoriaById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT id, nombre
      FROM categorias
      WHERE id = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /categorias
export const createCategoria = async (req, res, next) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const [dupe] = await pool.query(`
      SELECT id FROM categorias WHERE nombre = ?
    `, [nombre]);

    if (dupe.length) {
      return res.status(409).json({ message: "Ya existe una categoría con ese nombre." });
    }

    const [result] = await pool.query(`
      INSERT INTO categorias (nombre)
      VALUES (?)
    `, [nombre]);

    res.json({ message: "Categoría creada.", id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// PUT /categorias/:id
export const updateCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const [exists] = await pool.query(`
      SELECT id FROM categorias WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    const [dupe] = await pool.query(`
      SELECT id FROM categorias 
      WHERE nombre = ? AND id != ?
    `, [nombre, id]);

    if (dupe.length) {
      return res.status(409).json({ message: "Ya existe otra categoría con ese nombre." });
    }

    await pool.query(`
      UPDATE categorias
      SET nombre = ?
      WHERE id = ?
    `, [nombre, id]);

    res.json({ message: "Categoría actualizada." });
  } catch (error) {
    next(error);
  }
};

// DELETE /categorias/:id
export const deleteCategoria = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query(`
      SELECT id FROM categorias WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Categoría no encontrada." });
    }

    await pool.query(`DELETE FROM categorias WHERE id = ?`, [id]);

    res.json({ message: "Categoría eliminada." });
  } catch (error) {
    next(error);
  }
};
