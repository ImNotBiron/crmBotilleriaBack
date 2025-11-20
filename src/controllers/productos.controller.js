// src/controllers/productos.controller.js
import pool from "../config/db.js";

// GET /productos
export const getAllProductos = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `
      SELECT 
        p.*, 
        -- ALIAS PARA QUE EL FRONTEND LO LEA DIRECTO
        c.nombre AS categoria_producto,
        prov.nombre AS distribuidora_producto,
        e.nombre AS envase_nombre,
        um.codigo AS unidad_codigo
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      LEFT JOIN proveedores prov ON p.id_proveedor_preferido = prov.id
      LEFT JOIN envases e ON p.id_envase = e.id
      LEFT JOIN unidades_medida um ON p.id_unidad_capacidad = um.id
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
        p.*, 
        c.nombre AS categoria_nombre,
        e.nombre AS envase_nombre,
        e.es_retornable,
        um.codigo AS unidad_codigo
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      LEFT JOIN envases e ON p.id_envase = e.id
      LEFT JOIN unidades_medida um ON p.id_unidad_capacidad = um.id
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
      // ✅ NUEVOS CAMPOS
      cantidad_mayorista = 0,
      precio_mayorista = 0
    } = req.body;

    await pool.query(
      `
      INSERT INTO productos 
      (codigo_producto, nombre_producto, precio_producto, exento_iva,
       id_categoria, id_envase, capacidad, id_unidad_capacidad,
       stock, stock_minimo, id_proveedor_preferido, 
       cantidad_mayorista, precio_mayorista) -- <--- AGREGADOS
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        cantidad_mayorista, // <---
        precio_mayorista    // <---
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
      // ✅ NUEVOS CAMPOS
      cantidad_mayorista,
      precio_mayorista
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
        id_proveedor_preferido = ?,
        cantidad_mayorista = ?,  -- <---
        precio_mayorista = ?     -- <---
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
        cantidad_mayorista, // <---
        precio_mayorista,   // <---
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

export const getProductoById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT 
        p.*, 
        c.nombre AS categoria_producto,
        prov.nombre AS distribuidora_producto,
        e.nombre AS envase_nombre,
        um.codigo AS unidad_codigo
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id
      LEFT JOIN proveedores prov ON p.id_proveedor_preferido = prov.id
      LEFT JOIN envases e ON p.id_envase = e.id
      LEFT JOIN unidades_medida um ON p.id_unidad_capacidad = um.id
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