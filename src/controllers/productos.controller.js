import pool from "../config/db.js";

// Listar todos los productos
export const getAllProductos = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM productos ORDER BY id DESC");
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Obtener producto por código de barras
export const getProductoByCodigo = async (req, res, next) => {
  try {
    const { codigo } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE codigo_producto = ? LIMIT 1",
      [codigo]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Obtener producto por ID
export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT * FROM productos WHERE id = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Crear nuevo producto
export const createProducto = async (req, res, next) => {
  try {
    const {
      codigo_producto,
      nombre_producto,
      precio_producto,
      exento_iva,
      categoria_producto,
      distribuidora_producto,
    } = req.body;

    await pool.query(
      `INSERT INTO productos (codigo_producto, nombre_producto, precio_producto, exento_iva, categoria_producto, distribuidora_producto)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        codigo_producto,
        nombre_producto,
        precio_producto,
        exento_iva,
        categoria_producto,
        distribuidora_producto,
      ]
    );

    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    next(error);
  }
};

// Actualizar producto
export const updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      codigo_producto,
      nombre_producto,
      precio_producto,
      exento_iva,
      categoria_producto,
      distribuidora_producto,
    } = req.body;

    await pool.query(
      `UPDATE productos
       SET codigo_producto = ?, nombre_producto = ?, precio_producto = ?, exento_iva = ?, categoria_producto = ?, distribuidora_producto = ?
       WHERE id = ?`,
      [
        codigo_producto,
        nombre_producto,
        precio_producto,
        exento_iva,
        categoria_producto,
        distribuidora_producto,
        id,
      ]
    );

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

// Eliminar producto
export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
};
