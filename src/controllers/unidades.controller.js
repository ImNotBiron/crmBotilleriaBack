import pool from "../config/db.js";

// GET /unidades-medida
export const getUnidades = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        codigo,
        descripcion
      FROM unidades_medida
      ORDER BY descripcion ASC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /unidades-medida/:id
export const getUnidadById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT id, codigo, descripcion
      FROM unidades_medida
      WHERE id = ?
    `, [id]);

    if (!rows.length) {
      return res.status(404).json({ message: "Unidad no encontrada." });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// POST /unidades-medida
export const createUnidad = async (req, res, next) => {
  try {
    const { codigo, descripcion } = req.body;

    if (!codigo || !descripcion) {
      return res.status(400).json({ message: "Debe ingresar código y descripción." });
    }

    const [dupe] = await pool.query(`
      SELECT id FROM unidades_medida WHERE codigo = ?
    `, [codigo]);

    if (dupe.length) {
      return res.status(409).json({ message: "Ya existe una unidad con ese código." });
    }

    const [result] = await pool.query(`
      INSERT INTO unidades_medida (codigo, descripcion)
      VALUES (?, ?)
    `, [codigo, descripcion]);

    res.json({ message: "Unidad creada.", id: result.insertId });
  } catch (error) {
    next(error);
  }
};

// PUT /unidades-medida/:id
export const updateUnidad = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { codigo, descripcion } = req.body;

    if (!codigo || !descripcion) {
      return res.status(400).json({ message: "Debe ingresar código y descripción." });
    }

    const [exists] = await pool.query(`
      SELECT id FROM unidades_medida WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Unidad no encontrada." });
    }

    const [dupe] = await pool.query(`
      SELECT id FROM unidades_medida 
      WHERE codigo = ? AND id != ?
    `, [codigo, id]);

    if (dupe.length) {
      return res.status(409).json({ message: "Ya existe otra unidad con ese código." });
    }

    await pool.query(`
      UPDATE unidades_medida
      SET codigo = ?, descripcion = ?
      WHERE id = ?
    `, [codigo, descripcion, id]);

    res.json({ message: "Unidad actualizada." });
  } catch (error) {
    next(error);
  }
};

// DELETE /unidades-medida/:id
export const deleteUnidad = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query(`
      SELECT id FROM unidades_medida WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Unidad no encontrada." });
    }

    await pool.query(`DELETE FROM unidades_medida WHERE id = ?`, [id]);

    res.json({ message: "Unidad eliminada." });
  } catch (error) {
    next(error);
  }
};
