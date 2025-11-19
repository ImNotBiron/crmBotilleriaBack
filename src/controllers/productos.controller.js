// src/controllers/productos.controller.js
import pool from "../config/db.js";

// GET /productos
// Lista productos + info de categoría, envase, unidad y proveedor preferido
export const getAllProductos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.codigo_producto,
        p.nombre_producto,
        p.precio_producto,
        p.exento_iva,
        p.created_at,
        p.id_categoria,
        c.nombre AS categoria_nombre,
        p.id_envase,
        e.nombre AS envase_nombre,
        p.capacidad,
        p.id_unidad_capacidad,
        um.codigo AS unidad_codigo,
        um.descripcion AS unidad_descripcion,
        p.stock,
        p.stock_minimo,
        p.id_proveedor_preferido,
        prov.nombre AS proveedor_preferido_nombre
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      LEFT JOIN envases e ON p.id_envase = e.id
      LEFT JOIN unidades_medida um ON p.id_unidad_capacidad = um.id
      LEFT JOIN proveedores prov ON p.id_proveedor_preferido = prov.id
      ORDER BY p.id DESC
      `
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// GET /productos/codigo/:codigo
export const getProductoByCodigo = async (req, res, next) => {
  try {
    const { codigo } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.codigo_producto,
        p.nombre_producto,
        p.precio_producto,
        p.exento_iva,
        p.created_at,
        p.id_categoria,
        p.id_envase,
        p.capacidad,
        p.id_unidad_capacidad,
        p.stock,
        p.stock_minimo,
        p.id_proveedor_preferido
      FROM productos p
      WHERE p.codigo_producto = ?
      LIMIT 1
      `,
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

// GET /productos/:id
export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        p.id,
        p.codigo_producto,
        p.nombre_producto,
        p.precio_producto,
        p.exento_iva,
        p.created_at,
        p.id_categoria,
        p.id_envase,
        p.capacidad,
        p.id_unidad_capacidad,
        p.stock,
        p.stock_minimo,
        p.id_proveedor_preferido
      FROM productos p
      WHERE p.id = ?
      `,
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

// POST /productos
export const createProducto = async (req, res, next) => {
  try {
    const {
      codigo_producto,
      nombre_producto,
      precio_producto,
      exento_iva = 0,
      id_categoria = null,
      id_envase = null,
      capacidad = null,
      id_unidad_capacidad = null,
      stock = 0,
      stock_minimo = 0,
      id_proveedor_preferido = null,
    } = req.body;

    await pool.query(
      `
      INSERT INTO productos 
      (codigo_producto, nombre_producto, precio_producto, exento_iva,
       id_categoria, id_envase, capacidad, id_unidad_capacidad,
       stock, stock_minimo, id_proveedor_preferido)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        codigo_producto,
        nombre_producto,
        precio_producto,
        exento_iva,
        id_categoria,
        id_envase,
        capacidad,
        id_unidad_capacidad,
        stock,
        stock_minimo,
        id_proveedor_preferido,
      ]
    );

    res.json({ message: "Producto agregado correctamente" });
  } catch (error) {
    next(error);
  }
};

// PUT /productos/:id
export const updateProducto = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      codigo_producto,
      nombre_producto,
      precio_producto,
      exento_iva,
      id_categoria,
      id_envase,
      capacidad,
      id_unidad_capacidad,
      stock,
      stock_minimo,
      id_proveedor_preferido,
    } = req.body;

    await pool.query(
      `
      UPDATE productos
      SET 
        codigo_producto = ?, 
        nombre_producto = ?, 
        precio_producto = ?, 
        exento_iva = ?, 
        id_categoria = ?, 
        id_envase = ?, 
        capacidad = ?, 
        id_unidad_capacidad = ?,
        stock = ?,
        stock_minimo = ?,
        id_proveedor_preferido = ?
      WHERE id = ?
      `,
      [
        codigo_producto,
        nombre_producto,
        precio_producto,
        exento_iva,
        id_categoria,
        id_envase,
        capacidad,
        id_unidad_capacidad,
        stock,
        stock_minimo,
        id_proveedor_preferido,
        id,
      ]
    );

    res.json({ message: "Producto actualizado correctamente" });
  } catch (error) {
    next(error);
  }
};

// DELETE /productos/:id
export const deleteProducto = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.query("DELETE FROM productos WHERE id = ?", [id]);

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    next(error);
  }
};
