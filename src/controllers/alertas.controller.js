import pool from "../config/db.js";

// Obtener todas las alertas
export const getAlertas = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.id_producto,
        p.nombre_producto,
        a.mensaje,
        a.visto,
        a.fecha
      FROM alertas_stock a
      LEFT JOIN productos p ON p.id = a.id_producto
      ORDER BY a.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Obtener alertas NO vistas (pendientes)
export const getAlertasPendientes = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.id_producto,
        p.nombre_producto,
        a.mensaje,
        a.visto,
        a.fecha
      FROM alertas_stock a
      LEFT JOIN productos p ON p.id = a.id_producto
      WHERE a.visto = 0
      ORDER BY a.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Obtener alertas vistas (resueltas)
export const getAlertasResueltas = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        a.id,
        a.id_producto,
        p.nombre_producto,
        a.mensaje,
        a.visto,
        a.fecha
      FROM alertas_stock a
      LEFT JOIN productos p ON p.id = a.id_producto
      WHERE a.visto = 1
      ORDER BY a.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Marcar alerta como vista / resuelta
export const resolverAlerta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query(`
      SELECT id FROM alertas_stock WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Alerta no encontrada." });
    }

    await pool.query(`
      UPDATE alertas_stock
      SET visto = 1
      WHERE id = ?
    `, [id]);

    res.json({ message: "Alerta marcada como vista." });
  } catch (error) {
    next(error);
  }
};

// Eliminar alerta
export const deleteAlerta = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [exists] = await pool.query(`
      SELECT id FROM alertas_stock WHERE id = ?
    `, [id]);

    if (!exists.length) {
      return res.status(404).json({ message: "Alerta no encontrada." });
    }

    await pool.query(`
      DELETE FROM alertas_stock WHERE id = ?
    `, [id]);

    res.json({ message: "Alerta eliminada." });
  } catch (error) {
    next(error);
  }
};
