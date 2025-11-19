import pool from "../config/db.js";

/**
 * GET /api/promociones
 * Lista TODAS las promociones (admin)
 */
export const getPromociones = async (req, res, next) => {
  try {
    const [promos] = await pool.query(
      "SELECT * FROM promociones ORDER BY id DESC"
    );

    for (const promo of promos) {
      const [detalles] = await pool.query(
        `SELECT d.*, p.nombre_producto
         FROM promociones_detalle d
         JOIN productos p ON p.id = d.id_producto
         WHERE d.id_promocion = ?`,
        [promo.id]
      );
      promo.detalles = detalles;
    }

    res.json(promos);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/promociones/activas
 * Lista promociones activas (para vendedor)
 */
export const getPromocionesActivas = async (req, res, next) => {
  try {
    const [promos] = await pool.query(
      "SELECT * FROM promociones WHERE activa = 1 ORDER BY id DESC"
    );

    for (const promo of promos) {
      const [detalles] = await pool.query(
        `SELECT d.*, p.nombre_producto
         FROM promociones_detalle d
         JOIN productos p ON p.id = d.id_producto
         WHERE d.id_promocion = ?`,
        [promo.id]
      );
      promo.detalles = detalles;
    }

    res.json(promos);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/promociones/:id
 */
export const getPromocionById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM promociones WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Promoción no encontrada." });
    }

    const promo = rows[0];

    const [detalles] = await pool.query(
      `SELECT d.*, p.nombre_producto
       FROM promociones_detalle d
       JOIN productos p ON p.id = d.id_producto
       WHERE d.id_promocion = ?`,
      [id]
    );

    promo.detalles = detalles;

    res.json(promo);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/promociones
 * Body:
 * {
 *   nombre,
 *   descripcion,
 *   precio_promocion,
 *   detalles: [
 *     { id_producto, cantidad, es_gratis, es_variable }
 *   ]
 * }
 */
export const createPromocion = async (req, res, next) => {
  const { nombre, descripcion, precio_promocion, detalles } = req.body;

  let conn;

  try {
    if (!nombre || !precio_promocion) {
      return res
        .status(400)
        .json({ message: "Nombre y precio_promocion son obligatorios." });
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      return res
        .status(400)
        .json({ message: "Debe incluir al menos un producto en la promoción." });
    }

    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [promoRes] = await conn.query(
      `INSERT INTO promociones (nombre, descripcion, precio_promocion, activa)
       VALUES (?, ?, ?, 1)`,
      [nombre, descripcion || null, precio_promocion]
    );

    const idPromo = promoRes.insertId;

    for (const d of detalles) {
      await conn.query(
        `INSERT INTO promociones_detalle
         (id_promocion, id_producto, cantidad, es_gratis, es_variable)
         VALUES (?, ?, ?, ?, ?)`,
        [
          idPromo,
          d.id_producto,
          d.cantidad || 1,
          d.es_gratis ? 1 : 0,
          d.es_variable ? 1 : 0,
        ]
      );
    }

    await conn.commit();

    res.json({ message: "Promoción creada.", id_promocion: idPromo });
  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * PUT /api/promociones/:id
 * Permite editar la promo y rearmar el detalle completo
 */
export const updatePromocion = async (req, res, next) => {
  const { id } = req.params;
  const { nombre, descripcion, precio_promocion, detalles } = req.body;

  let conn;

  try {
    conn = await pool.getConnection();
    await conn.beginTransaction();

    const [rows] = await conn.query(
      "SELECT * FROM promociones WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      await conn.rollback();
      return res.status(404).json({ message: "Promoción no encontrada." });
    }

    await conn.query(
      `UPDATE promociones
       SET nombre = ?, descripcion = ?, precio_promocion = ?
       WHERE id = ?`,
      [nombre, descripcion || null, precio_promocion, id]
    );

    // Borrar detalles anteriores
    await conn.query(
      "DELETE FROM promociones_detalle WHERE id_promocion = ?",
      [id]
    );

    // Insertar nuevos detalles
    if (Array.isArray(detalles)) {
      for (const d of detalles) {
        await conn.query(
          `INSERT INTO promociones_detalle
           (id_promocion, id_producto, cantidad, es_gratis, es_variable)
           VALUES (?, ?, ?, ?, ?)`,
          [
            id,
            d.id_producto,
            d.cantidad || 1,
            d.es_gratis ? 1 : 0,
            d.es_variable ? 1 : 0,
          ]
        );
      }
    }

    await conn.commit();

    res.json({ message: "Promoción actualizada." });
  } catch (error) {
    if (conn) await conn.rollback();
    next(error);
  } finally {
    if (conn) conn.release();
  }
};

/**
 * PATCH /api/promociones/:id/estado
 * Body: { activa: 0 | 1 }
 */
export const updateEstadoPromocion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { activa } = req.body;

    await pool.query(
      "UPDATE promociones SET activa = ? WHERE id = ?",
      [activa ? 1 : 0, id]
    );

    res.json({ message: "Estado de promoción actualizado." });
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/promociones/:id
 */
export const deletePromocion = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM promociones WHERE id = ?", [id]);

    res.json({ message: "Promoción eliminada." });
  } catch (error) {
    next(error);
  }
};
