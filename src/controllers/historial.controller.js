import pool from "../config/db.js";

// Obtener todo el historial
export const getHistorialCompleto = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        h.id,
        h.id_producto,
        p.nombre_producto,
        h.tipo,
        h.cantidad,
        h.referencia,
        h.comentario,
        h.fecha
      FROM historial_stock h
      LEFT JOIN productos p ON p.id = h.id_producto
      ORDER BY h.fecha DESC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Obtener historial por producto
export const getHistorialPorProducto = async (req, res, next) => {
  try {
    const { id_producto } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        h.id,
        h.id_producto,
        p.nombre_producto,
        h.tipo,
        h.cantidad,
        h.referencia,
        h.comentario,
        h.fecha
      FROM historial_stock h
      LEFT JOIN productos p ON p.id = h.id_producto
      WHERE h.id_producto = ?
      ORDER BY h.fecha DESC
    `, [id_producto]);

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Registrar entrada manual
export const registrarEntrada = async (req, res, next) => {
  try {
    const { id_producto, cantidad, comentario = "" } = req.body;

    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "Datos inválidos." });
    }

    // Actualizar stock
    await pool.query(
      `UPDATE productos SET stock = stock + ? WHERE id = ?`,
      [cantidad, id_producto]
    );

    // Registrar en historial
    await pool.query(
      `
      INSERT INTO historial_stock (id_producto, tipo, cantidad, referencia, comentario)
      VALUES (?, 'entrada', ?, 'ENTRADA_MANUAL', ?)
      `,
      [id_producto, cantidad, comentario]
    );

    res.json({ message: "Entrada registrada correctamente." });
  } catch (error) {
    next(error);
  }
};

// Registrar salida manual
export const registrarSalida = async (req, res, next) => {
  try {
    const { id_producto, cantidad, comentario = "" } = req.body;

    if (!id_producto || !cantidad || cantidad <= 0) {
      return res.status(400).json({ message: "Datos inválidos." });
    }

    // Actualizar stock
    await pool.query(
      `UPDATE productos SET stock = stock - ? WHERE id = ?`,
      [cantidad, id_producto]
    );

    // Registrar historial
    await pool.query(
      `
      INSERT INTO historial_stock (id_producto, tipo, cantidad, referencia, comentario)
      VALUES (?, 'salida', ?, 'SALIDA_MANUAL', ?)
      `,
      [id_producto, cantidad, comentario]
    );

    res.json({ message: "Salida registrada correctamente." });
  } catch (error) {
    next(error);
  }
};
