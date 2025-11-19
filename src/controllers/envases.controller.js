import pool from "../config/db.js";

// GET /envases
export const getEnvases = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        nombre
      FROM envases
      ORDER BY nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /envases/:id
export const getEnvaseById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT id, nombre
      FROM envases
      WHERE id = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Envase no encontrado." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /envases
export const createEnvase = async (req, res, next) => {
  try {
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const [dupe] = await pool.query(`
      SELECT id FROM envases WHERE nombre = ?
    `, [nombre]);

    if (dupe.length) {
      return res.status(409).json({ message: "Ya existe un envase con ese nombre." });
    }

    const [result] = await pool.query(`
      INSERT INTO envases (nombre)
      VALUES (?)
    `, [nombre]);

    res.json({ message: "Envase creado.", id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// PUT /envases/:id
export const updateEnvase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
      return res.status(400).json({ message: "El nombre es obligatorio." });
    }

    const [exists] = await pool.query(`
      SELECT id FROM envases WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Envase no encontrado." });
    }

    const [dupe] = await pool.query(`
      SELECT id FROM envases 
      WHERE nombre = ? AND id != ?
    `, [nombre, id]);

    if (dupe.length) {
      return res.status(409).json({ message: "Ya existe otro envase con ese nombre." });
    }

    await pool.query(`
      UPDATE envases
      SET nombre = ?
      WHERE id = ?
    `, [nombre, id]);

    res.json({ message: "Envase actualizado." });
  } catch (error) {
    next(error);
  }
};

// DELETE /envases/:id
export const deleteEnvase = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query(`
      SELECT id FROM envases WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Envase no encontrado." });
    }

    await pool.query(`DELETE FROM envases WHERE id = ?`, [id]);

    res.json({ message: "Envase eliminado." });
  } catch (error) {
    next(error);
  }
};
