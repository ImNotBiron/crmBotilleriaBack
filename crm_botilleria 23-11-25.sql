-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 23-11-2025 a las 20:36:42
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `crm_botilleria`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `alertas_stock`
--

CREATE TABLE `alertas_stock` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `mensaje` varchar(200) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp(),
  `visto` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `alertas_stock`
--

INSERT INTO `alertas_stock` (`id`, `id_producto`, `mensaje`, `fecha`, `visto`) VALUES
(1, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: 9, mínimo: 12.', '2025-11-20 16:46:29', 0),
(2, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: -3, mínimo: 12.', '2025-11-20 17:03:59', 0),
(3, 10, 'Stock crítico del producto \"Cigarro Lucky Strike Box 20\" (ID 10). Stock actual: 19, mínimo: 20.', '2025-11-20 18:54:43', 0),
(4, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: -4, mínimo: 12.', '2025-11-21 01:44:42', 0),
(5, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: -5, mínimo: 12.', '2025-11-21 16:55:37', 0),
(6, 7, 'Stock crítico del producto \"Whisky Johnnie Walker Red Label 750ml\" (ID 7). Stock actual: 3, mínimo: 3.', '2025-11-21 17:25:30', 0),
(7, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: -17, mínimo: 12.', '2025-11-21 17:25:30', 0),
(8, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: -18, mínimo: 12.', '2025-11-21 17:31:35', 0),
(9, 1, 'Stock crítico del producto \"Cerveza Corona 330ml\" (ID 1). Stock actual: -30, mínimo: 12.', '2025-11-21 17:49:35', 0),
(10, 7, 'Stock crítico del producto \"Whisky Johnnie Walker Red Label 750ml\" (ID 7). Stock actual: 2, mínimo: 3.', '2025-11-21 17:49:35', 0),
(11, 7, 'Stock crítico del producto \"Whisky Johnnie Walker Red Label 750ml\" (ID 7). Stock actual: 1, mínimo: 3.', '2025-11-21 17:49:35', 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja_movimientos`
--

CREATE TABLE `caja_movimientos` (
  `id` int(11) NOT NULL,
  `id_caja_sesion` int(11) NOT NULL,
  `tipo` enum('INGRESO','EGRESO') NOT NULL,
  `monto` int(11) NOT NULL,
  `comentario` varchar(255) NOT NULL,
  `fecha` datetime NOT NULL DEFAULT current_timestamp(),
  `id_usuario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caja_movimientos`
--

INSERT INTO `caja_movimientos` (`id`, `id_caja_sesion`, `tipo`, `monto`, `comentario`, `fecha`, `id_usuario`) VALUES
(1, 5, 'EGRESO', 10000, 'Compra Colacion Vendedores', '2025-11-21 17:01:13', 1),
(2, 8, 'EGRESO', 5000, 'Colacion turno.', '2025-11-21 17:24:00', 1),
(3, 9, 'EGRESO', 10000, 'Colacion', '2025-11-22 12:16:25', 1),
(4, 9, 'EGRESO', 42000, 'Pago Hielo Mario', '2025-11-22 13:32:08', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caja_sesiones`
--

CREATE TABLE `caja_sesiones` (
  `id` int(11) NOT NULL,
  `fecha_apertura` datetime NOT NULL DEFAULT current_timestamp(),
  `fecha_cierre` datetime DEFAULT NULL,
  `monto_inicial` int(11) NOT NULL DEFAULT 0,
  `total_ventas_efectivo` int(11) DEFAULT 0,
  `total_ventas_digital` int(11) DEFAULT 0,
  `monto_final_real` int(11) DEFAULT 0,
  `diferencia` int(11) DEFAULT 0,
  `id_usuario` int(11) NOT NULL,
  `estado` enum('abierta','cerrada') NOT NULL DEFAULT 'abierta'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caja_sesiones`
--

INSERT INTO `caja_sesiones` (`id`, `fecha_apertura`, `fecha_cierre`, `monto_inicial`, `total_ventas_efectivo`, `total_ventas_digital`, `monto_final_real`, `diferencia`, `id_usuario`, `estado`) VALUES
(1, '2025-11-20 15:40:30', '2025-11-20 15:55:33', 100000, 40000, 0, 140000, 0, 1, 'cerrada'),
(2, '2025-11-21 16:31:17', '2025-11-21 16:37:03', 150000, 0, 0, 150000, 0, 1, 'cerrada'),
(3, '2025-11-21 16:40:54', '2025-11-21 16:41:05', 15000, 0, 0, 15000, 0, 1, 'cerrada'),
(4, '2025-11-21 16:53:23', '2025-11-21 16:53:33', 150000, 0, 0, 150000, 0, 1, 'cerrada'),
(5, '2025-11-21 17:00:47', '2025-11-21 17:03:05', 150000, 0, 0, 140000, 0, 1, 'cerrada'),
(6, '2025-11-21 17:08:28', '2025-11-21 17:12:46', 150000, 0, 0, 150000, 0, 1, 'cerrada'),
(7, '2025-11-21 17:12:55', '2025-11-21 17:23:32', 200000, 0, 0, 200000, 0, 1, 'cerrada'),
(8, '2025-11-21 17:23:40', '2025-11-22 11:17:10', 100000, 68000, 0, 163000, 0, 1, 'cerrada'),
(9, '2025-11-22 11:18:26', NULL, 400000, 0, 0, 0, 0, 1, 'abierta');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `descripcion` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `categorias`
--

INSERT INTO `categorias` (`id`, `nombre`, `descripcion`) VALUES
(1, 'Cervezas', NULL),
(2, 'Bebidas', NULL),
(3, 'Licores', NULL),
(4, 'Vinos', NULL),
(5, 'Espumantes', NULL),
(6, 'Aguas', NULL),
(7, 'Energéticas', NULL),
(8, 'Jugos', NULL),
(9, 'Snacks', NULL),
(10, 'Cigarros', NULL),
(11, 'Hielo', NULL),
(12, 'Otros', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `envases`
--

CREATE TABLE `envases` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) NOT NULL,
  `es_retornable` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `envases`
--

INSERT INTO `envases` (`id`, `nombre`, `es_retornable`) VALUES
(1, 'Botella', 0),
(2, 'Botellín', 0),
(3, 'Lata', 0),
(4, 'Tetrapak', 0),
(5, 'Pack', 0),
(6, 'Cajetilla', 0),
(7, 'Caja', 0),
(8, 'Botella Retornable', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas_compra`
--

CREATE TABLE `facturas_compra` (
  `id` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `numero_factura` varchar(50) NOT NULL,
  `fecha_factura` date NOT NULL,
  `monto_total` decimal(10,2) NOT NULL,
  `estado` enum('pendiente','revisada','aceptada') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas_compra`
--

INSERT INTO `facturas_compra` (`id`, `id_proveedor`, `numero_factura`, `fecha_factura`, `monto_total`, `estado`) VALUES
(1, 4, 'F-54321', '2025-01-16', 118000.00, 'revisada');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `facturas_compra_detalle`
--

CREATE TABLE `facturas_compra_detalle` (
  `id` int(11) NOT NULL,
  `id_factura` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad_recibida` int(11) NOT NULL,
  `precio_unitario` decimal(10,2) NOT NULL,
  `subtotal` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `facturas_compra_detalle`
--

INSERT INTO `facturas_compra_detalle` (`id`, `id_factura`, `id_producto`, `cantidad_recibida`, `precio_unitario`, `subtotal`) VALUES
(1, 1, 1, 20, 700.00, 14000.00),
(2, 1, 2, 30, 780.00, 23400.00),
(3, 1, 9, 10, 650.00, 6500.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `historial_stock`
--

CREATE TABLE `historial_stock` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `tipo` enum('venta','compra','ajuste','merma','inventario') NOT NULL,
  `cantidad` int(11) NOT NULL,
  `referencia` varchar(50) DEFAULT NULL,
  `comentario` varchar(200) DEFAULT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `historial_stock`
--

INSERT INTO `historial_stock` (`id`, `id_producto`, `tipo`, `cantidad`, `referencia`, `comentario`, `fecha`) VALUES
(1, 1, 'venta', 1, 'VENTA:2', 'Venta registrada por usuario 2', '2025-11-20 14:19:45'),
(2, 4, 'venta', 1, 'VENTA:2', 'Venta registrada por usuario 2', '2025-11-20 14:19:45'),
(3, 7, 'venta', 1, 'VENTA:2', 'Venta registrada por usuario 2', '2025-11-20 14:19:45'),
(4, 10, 'venta', 1, 'VENTA:2', 'Venta registrada por usuario 2', '2025-11-20 14:19:45'),
(25, 7, 'venta', 1, 'VENTA:7', 'Venta registrada por usuario 2', '2025-11-20 14:35:49'),
(26, 4, 'venta', 1, 'VENTA:7', 'Venta registrada por usuario 2', '2025-11-20 14:35:49'),
(27, 11, 'venta', 1, 'VENTA:7', 'Venta registrada por usuario 2', '2025-11-20 14:35:49'),
(28, 1, 'venta', 1, 'VENTA:7', 'Venta registrada por usuario 2', '2025-11-20 14:35:49'),
(29, 8, 'venta', 1, 'VENTA:7', 'Venta registrada por usuario 2', '2025-11-20 14:35:49'),
(30, 10, 'venta', 1, 'VENTA:7', 'Venta registrada por usuario 2', '2025-11-20 14:35:49'),
(31, 1, 'venta', 13, 'VENTA:8', 'Venta registrada por usuario 2', '2025-11-20 16:46:29'),
(32, 1, 'venta', 12, 'VENTA:9', 'Venta registrada por usuario 2', '2025-11-20 17:03:59'),
(33, 7, 'venta', 1, 'VENTA:9', 'Venta registrada por usuario 2', '2025-11-20 17:03:59'),
(34, 4, 'venta', 1, 'VENTA:9', 'Venta registrada por usuario 2', '2025-11-20 17:03:59'),
(35, 11, 'venta', 1, 'VENTA:9', 'Venta registrada por usuario 2', '2025-11-20 17:03:59'),
(36, 10, 'venta', 1, 'VENTA:9', 'Venta registrada por usuario 2', '2025-11-20 17:03:59'),
(37, 8, 'venta', 1, 'VENTA:9', 'Venta registrada por usuario 2', '2025-11-20 17:03:59'),
(38, 10, 'venta', 8, 'VENTA:10', 'Venta registrada por usuario 2', '2025-11-20 17:24:04'),
(39, 10, 'venta', 10, 'VENTA:11', 'Venta registrada por usuario 2', '2025-11-20 18:54:43'),
(40, 1, 'venta', 1, 'VENTA:12', 'Venta registrada por usuario 2', '2025-11-21 01:44:42'),
(41, 1, 'venta', 1, 'VENTA:13', 'Venta registrada por usuario 2', '2025-11-21 16:55:37'),
(42, 2, 'venta', 1, 'VENTA:13', 'Venta registrada por usuario 2', '2025-11-21 16:55:37'),
(43, 7, 'venta', 1, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(44, 4, 'venta', 1, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(45, 11, 'venta', 1, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(46, 7, 'venta', 1, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(47, 4, 'venta', 1, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(48, 11, 'venta', 1, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(49, 1, 'venta', 12, 'VENTA:14', 'Venta registrada por usuario 2', '2025-11-21 17:25:30'),
(50, 2, 'venta', 1, 'VENTA:15', 'Venta registrada por usuario 2', '2025-11-21 17:31:35'),
(51, 1, 'venta', 1, 'VENTA:15', 'Venta registrada por usuario 2', '2025-11-21 17:31:35'),
(52, 2, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(53, 1, 'venta', 12, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(54, 7, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(55, 4, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(56, 11, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(57, 7, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(58, 4, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35'),
(59, 11, 'venta', 1, 'VENTA:16', 'Venta registrada por usuario 2', '2025-11-21 17:49:35');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `mermas`
--

CREATE TABLE `mermas` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `mermas`
--

INSERT INTO `mermas` (`id`, `id_producto`, `cantidad`, `motivo`, `id_usuario`, `fecha`) VALUES
(1, 1, 2, 'Botellas rotas en bodega', 1, '2025-11-19 15:57:00'),
(2, 9, 1, 'Producto vencido', 1, '2025-11-19 15:57:00');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `notas_credito_proveedor`
--

CREATE TABLE `notas_credito_proveedor` (
  `id` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_factura_compra` int(11) DEFAULT NULL,
  `monto` decimal(10,2) NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `fecha_emision` date DEFAULT NULL,
  `fecha_registro` timestamp NOT NULL DEFAULT current_timestamp(),
  `estado` enum('pendiente','aplicada','vencida') DEFAULT 'pendiente'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `notas_credito_proveedor`
--

INSERT INTO `notas_credito_proveedor` (`id`, `id_proveedor`, `id_factura_compra`, `monto`, `motivo`, `fecha_emision`, `fecha_registro`, `estado`) VALUES
(1, 4, 1, 6500.00, 'No llegaron 10 unidades de Lays', '2025-01-17', '2025-11-19 15:57:00', 'pendiente');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_compra`
--

CREATE TABLE `ordenes_compra` (
  `id` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `id_vendedor_proveedor` int(11) DEFAULT NULL,
  `fecha` datetime DEFAULT current_timestamp(),
  `estado` enum('pendiente','recibida','cancelada') DEFAULT 'pendiente',
  `total_estimado` decimal(10,2) DEFAULT 0.00
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes_compra`
--

INSERT INTO `ordenes_compra` (`id`, `id_proveedor`, `id_vendedor_proveedor`, `fecha`, `estado`, `total_estimado`) VALUES
(1, 4, 4, '2025-11-19 12:56:59', 'pendiente', 120000.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ordenes_compra_detalle`
--

CREATE TABLE `ordenes_compra_detalle` (
  `id` int(11) NOT NULL,
  `id_orden` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_estimado` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ordenes_compra_detalle`
--

INSERT INTO `ordenes_compra_detalle` (`id`, `id_orden`, `id_producto`, `cantidad`, `precio_estimado`) VALUES
(1, 1, 1, 20, 700.00),
(2, 1, 2, 30, 780.00),
(3, 1, 9, 10, 650.00);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `id` int(11) NOT NULL,
  `codigo_producto` varchar(50) NOT NULL,
  `nombre_producto` varchar(100) NOT NULL,
  `precio_producto` decimal(10,2) NOT NULL,
  `exento_iva` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id_categoria` int(11) DEFAULT NULL,
  `id_envase` int(11) DEFAULT NULL,
  `capacidad` int(11) DEFAULT NULL,
  `id_unidad_capacidad` int(11) DEFAULT NULL,
  `stock` int(11) NOT NULL DEFAULT 0,
  `stock_minimo` int(11) NOT NULL DEFAULT 0,
  `id_proveedor_preferido` int(11) DEFAULT NULL,
  `cantidad_mayorista` int(11) DEFAULT 0 COMMENT 'Cantidad minima para activar precio oferta',
  `precio_mayorista` int(11) DEFAULT 0 COMMENT 'Precio unitario al cumplir la cantidad'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `productos`
--

INSERT INTO `productos` (`id`, `codigo_producto`, `nombre_producto`, `precio_producto`, `exento_iva`, `created_at`, `id_categoria`, `id_envase`, `capacidad`, `id_unidad_capacidad`, `stock`, `stock_minimo`, `id_proveedor_preferido`, `cantidad_mayorista`, `precio_mayorista`) VALUES
(1, 'C001', 'Cerveza Corona 330ml', 1300.00, 0, '2025-11-19 15:56:59', 1, 1, 330, 1, -48, 12, 1, 12, 1000),
(2, 'C002', 'Cerveza Heineken 330ml', 1400.00, 0, '2025-11-19 15:56:59', 1, 1, 330, 1, 26, 12, 1, 0, 0),
(3, 'C003', 'Cerveza Cristal 1L Retornable', 1400.00, 0, '2025-11-19 15:56:59', 1, 8, 1000, 1, 15, 10, 1, 0, 0),
(4, 'B001', 'Coca-Cola 1.5L', 1500.00, 0, '2025-11-19 15:56:59', 2, 1, 1500, 1, 11, 10, 2, 0, 0),
(5, 'B002', 'Sprite 1.5L', 1400.00, 0, '2025-11-19 15:56:59', 2, 1, 1500, 1, 21, 10, 2, 0, 0),
(6, 'E001', 'Red Bull 250ml', 1800.00, 0, '2025-11-19 15:56:59', 7, 3, 250, 1, 12, 6, 3, 0, 0),
(7, 'L001', 'Whisky Johnnie Walker Red Label 750ml', 15000.00, 0, '2025-11-19 15:56:59', 3, 1, 750, 1, 1, 3, 4, 0, 0),
(8, 'L002', 'Pisco Mistral 35° 750ml', 8500.00, 0, '2025-11-19 15:56:59', 3, 1, 750, 1, 7, 4, 5, 0, 0),
(9, 'S001', 'Papas Fritas Lays 95g', 1200.00, 0, '2025-11-19 15:56:59', 9, NULL, 95, 2, 25, 10, 4, 0, 0),
(10, 'CI001', 'Cigarro Lucky Strike Box 20', 4000.00, 1, '2025-11-19 15:56:59', 10, 6, 20, 3, -6, 20, 5, 0, 0),
(11, 'HIELO01', 'Bolsa Hielo 1KG', 1000.00, 0, '2025-11-20 14:29:26', 11, NULL, NULL, NULL, -6, 0, 5, 0, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `producto_proveedor_precio`
--

CREATE TABLE `producto_proveedor_precio` (
  `id` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `precio_compra` decimal(10,2) NOT NULL,
  `fecha_actualizacion` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `producto_proveedor_precio`
--

INSERT INTO `producto_proveedor_precio` (`id`, `id_producto`, `id_proveedor`, `precio_compra`, `fecha_actualizacion`) VALUES
(1, 1, 1, 750.00, '2025-01-15'),
(2, 1, 4, 700.00, '2025-01-15'),
(3, 2, 1, 800.00, '2025-01-15'),
(4, 2, 4, 780.00, '2025-01-15'),
(5, 4, 2, 900.00, '2025-01-15'),
(6, 4, 3, 920.00, '2025-01-15'),
(7, 9, 4, 650.00, '2025-01-15'),
(8, 10, 5, 3700.00, '2025-01-15');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones`
--

CREATE TABLE `promociones` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `descripcion` varchar(255) DEFAULT NULL,
  `precio_promocion` int(11) NOT NULL,
  `activa` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `promociones_detalle`
--

CREATE TABLE `promociones_detalle` (
  `id` int(11) NOT NULL,
  `id_promocion` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL DEFAULT 1,
  `es_gratis` tinyint(1) NOT NULL DEFAULT 0,
  `es_variable` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proveedores`
--

CREATE TABLE `proveedores` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `rut` varchar(20) DEFAULT NULL,
  `direccion` varchar(150) DEFAULT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proveedores`
--

INSERT INTO `proveedores` (`id`, `nombre`, `rut`, `direccion`, `telefono`, `email`, `activo`, `created_at`) VALUES
(1, 'CCU', '96.545.320-1', NULL, '+56225782000', 'contacto@ccu.cl', 1, '2025-11-19 15:56:59'),
(2, 'Coca-Cola Andina', '76.222.222-2', NULL, '+56224405000', 'contacto@cocacolaandina.cl', 1, '2025-11-19 15:56:59'),
(3, 'Embotelladora Coca-Cola', '76.123.456-7', NULL, '+56227563000', 'ventas@coca-cola.cl', 1, '2025-11-19 15:56:59'),
(4, 'Distribuidora Zapata', '77.987.654-3', NULL, '+56987654321', 'ventas@zapata.cl', 1, '2025-11-19 15:56:59'),
(5, 'Distribuidora Gigante', '78.654.321-4', NULL, '+56965432198', 'contacto@gigante.cl', 1, '2025-11-19 15:56:59');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_medida`
--

CREATE TABLE `unidades_medida` (
  `id` int(11) NOT NULL,
  `codigo` varchar(10) NOT NULL,
  `descripcion` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `unidades_medida`
--

INSERT INTO `unidades_medida` (`id`, `codigo`, `descripcion`) VALUES
(1, 'ml', 'Mililitros'),
(2, 'g', 'Gramos'),
(3, 'u', 'Unidades'),
(4, 'l', 'Litros'),
(5, 'pack', 'Pack'),
(6, 'cc', 'Centímetros cúbicos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre_usuario` varchar(50) NOT NULL,
  `rut_usuario` varchar(12) NOT NULL,
  `password_usuario` varchar(255) DEFAULT NULL,
  `tipo_usuario` enum('admin','vendedor') NOT NULL DEFAULT 'vendedor',
  `activo` tinyint(1) NOT NULL DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `en_linea` tinyint(1) DEFAULT 0 COMMENT '1 = Conectado, 0 = Desconectado'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombre_usuario`, `rut_usuario`, `password_usuario`, `tipo_usuario`, `activo`, `created_at`, `en_linea`) VALUES
(1, 'Administrador', '12345678-9', NULL, 'admin', 1, '2025-11-19 15:56:59', 1),
(2, 'Vendedor 1', '11111111-1', NULL, 'vendedor', 1, '2025-11-19 15:56:59', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vendedores_proveedor`
--

CREATE TABLE `vendedores_proveedor` (
  `id` int(11) NOT NULL,
  `id_proveedor` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(30) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vendedores_proveedor`
--

INSERT INTO `vendedores_proveedor` (`id`, `id_proveedor`, `nombre`, `telefono`, `email`, `activo`) VALUES
(1, 1, 'Daniel CCU', '+56911112222', NULL, 1),
(2, 1, 'Pedro CCU', '+56911113333', NULL, 1),
(3, 2, 'Marcela Andina', '+56922221111', NULL, 1),
(4, 4, 'Luis Zapata', '+56933334444', NULL, 1),
(5, 5, 'Javier Gigante', '+56944445555', NULL, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas`
--

CREATE TABLE `ventas` (
  `id` int(11) NOT NULL,
  `total_general` int(11) NOT NULL,
  `total_afecto` int(11) NOT NULL,
  `total_exento` int(11) NOT NULL,
  `fecha` datetime NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `boleteado` tinyint(1) DEFAULT 0 COMMENT '1 = Boleta emitida ante SII',
  `tipo_venta` enum('NORMAL','INTERNA') DEFAULT 'NORMAL'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas`
--

INSERT INTO `ventas` (`id`, `total_general`, `total_afecto`, `total_exento`, `fecha`, `id_usuario`, `boleteado`, `tipo_venta`) VALUES
(1, 8400, 8400, 0, '2025-11-19 12:57:00', 2, 1, 'NORMAL'),
(2, 21800, 17800, 4000, '2025-11-20 11:19:45', 2, 1, 'NORMAL'),
(7, 29800, 25800, 4000, '2025-11-20 11:35:49', 2, 1, 'NORMAL'),
(8, 13000, 13000, 0, '2025-11-20 13:46:29', 2, 0, 'NORMAL'),
(9, 40500, 36500, 4000, '2025-11-20 14:03:59', 2, 1, 'NORMAL'),
(10, 32000, 0, 32000, '2025-11-20 14:24:04', 2, 1, 'NORMAL'),
(11, 40000, 0, 40000, '2025-11-20 15:54:43', 2, 1, 'NORMAL'),
(12, 1300, 1300, 0, '2025-11-20 22:44:42', 2, 1, 'NORMAL'),
(13, 2700, 2700, 0, '2025-11-21 13:55:37', 2, 1, 'NORMAL'),
(14, 45500, 45500, 0, '2025-11-21 14:25:30', 2, 1, 'NORMAL'),
(15, 2700, 2700, 0, '2025-11-21 14:31:35', 2, 1, 'NORMAL'),
(16, 46900, 46900, 0, '2025-11-21 14:49:35', 2, 1, 'NORMAL'),
(17, 40000, 0, 40000, '2025-11-21 17:24:32', 2, 1, 'NORMAL'),
(18, 16000, 0, 16000, '2025-11-21 17:51:18', 2, 1, 'NORMAL'),
(19, 12000, 12000, 0, '2025-11-21 17:52:43', 2, 1, 'NORMAL'),
(20, 6600, 6600, 0, '2025-11-22 12:17:21', 2, 1, 'NORMAL'),
(21, 20000, 0, 20000, '2025-11-22 12:43:09', 2, 1, 'NORMAL'),
(22, 24000, 0, 24000, '2025-11-22 13:21:04', 2, 1, 'NORMAL'),
(23, 2900, 2900, 0, '2025-11-22 13:33:05', 2, 1, 'NORMAL'),
(24, 2800, 2800, 0, '2025-11-22 13:36:11', 2, 1, 'NORMAL'),
(25, 1300, 1300, 0, '2025-11-23 16:33:06', 2, 0, 'NORMAL'),
(26, 5000, 5000, 0, '2025-11-23 16:33:56', 1, 1, 'INTERNA');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_detalles`
--

CREATE TABLE `ventas_detalles` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `id_producto` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `precio_unitario` int(11) NOT NULL,
  `exento_iva` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas_detalles`
--

INSERT INTO `ventas_detalles` (`id`, `id_venta`, `id_producto`, `cantidad`, `precio_unitario`, `exento_iva`) VALUES
(1, 1, 1, 4, 1300, 0),
(2, 1, 9, 1, 1200, 0),
(3, 2, 1, 1, 1300, 0),
(4, 2, 4, 1, 1500, 0),
(5, 2, 7, 1, 15000, 0),
(6, 2, 10, 1, 4000, 1),
(31, 7, 7, 1, 15000, 0),
(32, 7, 4, 1, 1000, 0),
(33, 7, 11, 1, 0, 0),
(34, 7, 1, 1, 1300, 0),
(35, 7, 8, 1, 8500, 0),
(36, 7, 10, 1, 4000, 1),
(37, 8, 1, 13, 1000, 0),
(38, 9, 1, 12, 1000, 0),
(39, 9, 7, 1, 15000, 0),
(40, 9, 4, 1, 1000, 0),
(41, 9, 11, 1, 0, 0),
(42, 9, 10, 1, 4000, 1),
(43, 9, 8, 1, 8500, 0),
(44, 10, 10, 8, 4000, 1),
(45, 11, 10, 10, 4000, 1),
(46, 12, 1, 1, 1300, 0),
(47, 13, 1, 1, 1300, 0),
(48, 13, 2, 1, 1400, 0),
(49, 14, 7, 1, 15000, 0),
(50, 14, 4, 1, 1000, 0),
(51, 14, 11, 1, 0, 0),
(52, 14, 7, 1, 15000, 0),
(53, 14, 4, 1, 1500, 0),
(54, 14, 11, 1, 1000, 0),
(55, 14, 1, 12, 1000, 0),
(56, 15, 2, 1, 1400, 0),
(57, 15, 1, 1, 1300, 0),
(58, 16, 2, 1, 1400, 0),
(59, 16, 1, 12, 1000, 0),
(60, 16, 7, 1, 15000, 0),
(61, 16, 4, 1, 1000, 0),
(62, 16, 11, 1, 0, 0),
(63, 16, 7, 1, 15000, 0),
(64, 16, 4, 1, 1500, 0),
(65, 16, 11, 1, 1000, 0),
(66, 17, 10, 10, 4000, 1),
(67, 18, 10, 4, 4000, 1),
(68, 19, 1, 12, 1000, 0),
(69, 20, 1, 4, 1300, 0),
(70, 20, 2, 1, 1400, 0),
(71, 21, 10, 5, 4000, 1),
(72, 22, 10, 6, 4000, 1),
(73, 23, 4, 1, 1500, 0),
(74, 23, 5, 1, 1400, 0),
(75, 24, 4, 1, 1500, 0),
(76, 24, 1, 1, 1300, 0),
(77, 25, 1, 1, 1300, 0),
(78, 26, 8, 1, 8500, 0);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `ventas_pagos`
--

CREATE TABLE `ventas_pagos` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `tipo_pago` varchar(50) NOT NULL,
  `monto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `ventas_pagos`
--

INSERT INTO `ventas_pagos` (`id`, `id_venta`, `tipo_pago`, `monto`) VALUES
(1, 1, 'EFECTIVO', 8400),
(2, 2, 'GIRO', 21800),
(7, 7, 'EFECTIVO', 29800),
(8, 8, 'DEBITO', 13000),
(9, 9, 'EFECTIVO', 40500),
(10, 10, 'EFECTIVO', 32000),
(11, 11, 'EFECTIVO', 40000),
(12, 12, 'EFECTIVO', 1300),
(13, 13, 'EFECTIVO', 2700),
(14, 14, 'EFECTIVO', 45500),
(15, 15, 'EFECTIVO', 2700),
(16, 16, 'EFECTIVO', 46900),
(17, 17, 'EFECTIVO', 40000),
(18, 18, 'EFECTIVO', 16000),
(19, 19, 'EFECTIVO', 12000),
(20, 20, 'EFECTIVO', 6600),
(21, 21, 'EFECTIVO', 20000),
(22, 22, 'EFECTIVO', 24000),
(23, 23, 'EFECTIVO', 2900),
(24, 24, 'EFECTIVO', 2800),
(25, 25, 'EFECTIVO', 1300),
(26, 26, 'EFECTIVO', 5000);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vouchers`
--

CREATE TABLE `vouchers` (
  `id` int(11) NOT NULL,
  `id_venta` int(11) NOT NULL,
  `folio_voucher` int(11) NOT NULL,
  `contenido` text NOT NULL,
  `fecha_impresion` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `vouchers`
--

INSERT INTO `vouchers` (`id`, `id_venta`, `folio_voucher`, `contenido`, `fecha_impresion`) VALUES
(1, 2, 2, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-20T14:19:45.434Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"cantidad\":1,\"precio\":\"1300.00\"},{\"id\":4,\"cantidad\":1,\"precio\":\"1500.00\"},{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":10,\"cantidad\":1,\"precio\":\"4000.00\"}],\"total\":21800,\"pagos\":[{\"tipo\":\"GIRO\",\"monto\":21800}]}', '2025-11-20 14:19:45'),
(2, 7, 7, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-20T14:35:49.246Z\",\"vendedor_id\":2,\"items\":[{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":4,\"cantidad\":1,\"precio\":1000},{\"id\":11,\"cantidad\":1,\"precio\":0},{\"id\":1,\"cantidad\":1,\"precio\":\"1300.00\"},{\"id\":8,\"cantidad\":1,\"precio\":\"8500.00\"},{\"id\":10,\"cantidad\":1,\"precio\":\"4000.00\"}],\"total\":29800,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":29800}]}', '2025-11-20 14:35:49'),
(3, 8, 8, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-20T16:46:29.165Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"cantidad\":13,\"precio\":1000}],\"total\":13000,\"pagos\":[{\"tipo\":\"DEBITO\",\"monto\":13000}]}', '2025-11-20 16:46:29'),
(4, 9, 9, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-20T17:03:59.414Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"cantidad\":12,\"precio\":1000},{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":4,\"cantidad\":1,\"precio\":1000},{\"id\":11,\"cantidad\":1,\"precio\":0},{\"id\":10,\"cantidad\":1,\"precio\":\"4000.00\"},{\"id\":8,\"cantidad\":1,\"precio\":\"8500.00\"}],\"total\":40500,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":40500}]}', '2025-11-20 17:03:59'),
(5, 10, 10, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-20T17:24:04.383Z\",\"vendedor_id\":2,\"items\":[{\"id\":10,\"cantidad\":8,\"precio\":\"4000.00\"}],\"total\":32000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":32000}]}', '2025-11-20 17:24:04'),
(6, 11, 11, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-20T18:54:43.390Z\",\"vendedor_id\":2,\"items\":[{\"id\":10,\"cantidad\":10,\"precio\":\"4000.00\"}],\"total\":40000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":40000}]}', '2025-11-20 18:54:43'),
(7, 12, 12, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T01:44:42.965Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"cantidad\":1,\"precio\":\"1300.00\"}],\"total\":1300,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":1300}]}', '2025-11-21 01:44:42'),
(8, 13, 13, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T16:55:37.970Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"cantidad\":1,\"precio\":\"1300.00\"},{\"id\":2,\"cantidad\":1,\"precio\":\"1400.00\"}],\"total\":2700,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":2700}]}', '2025-11-21 16:55:37'),
(9, 14, 14, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T17:25:30.165Z\",\"vendedor_id\":2,\"items\":[{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":4,\"cantidad\":1,\"precio\":1000},{\"id\":11,\"cantidad\":1,\"precio\":0},{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":4,\"cantidad\":1,\"precio\":\"1500.00\"},{\"id\":11,\"cantidad\":1,\"precio\":\"1000.00\"},{\"id\":1,\"cantidad\":12,\"precio\":1000}],\"total\":45500,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":45500}]}', '2025-11-21 17:25:30'),
(10, 15, 15, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T17:31:35.162Z\",\"vendedor_id\":2,\"items\":[{\"id\":2,\"cantidad\":1,\"precio\":\"1400.00\"},{\"id\":1,\"cantidad\":1,\"precio\":\"1300.00\"}],\"total\":2700,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":2700}]}', '2025-11-21 17:31:35'),
(11, 16, 16, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T17:49:35.472Z\",\"vendedor_id\":2,\"items\":[{\"id\":2,\"cantidad\":1,\"precio\":\"1400.00\"},{\"id\":1,\"cantidad\":12,\"precio\":1000},{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":4,\"cantidad\":1,\"precio\":1000},{\"id\":11,\"cantidad\":1,\"precio\":0},{\"id\":7,\"cantidad\":1,\"precio\":\"15000.00\"},{\"id\":4,\"cantidad\":1,\"precio\":\"1500.00\"},{\"id\":11,\"cantidad\":1,\"precio\":\"1000.00\"}],\"total\":46900,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":46900}]}', '2025-11-21 17:49:35'),
(12, 17, 17, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T20:24:32.416Z\",\"vendedor_id\":2,\"items\":[{\"id\":10,\"cantidad\":10,\"precio\":\"4000.00\"}],\"total\":40000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":40000}]}', '2025-11-21 20:24:32'),
(13, 18, 18, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T20:51:18.810Z\",\"vendedor_id\":2,\"items\":[{\"id\":10,\"nombre_producto\":\"Cigarro Lucky Strike Box 20\",\"cantidad\":4,\"precio\":\"4000.00\"}],\"total\":16000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":16000}]}', '2025-11-21 20:51:18'),
(14, 19, 19, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-21T20:52:43.408Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"nombre_producto\":\"Cerveza Corona 330ml\",\"cantidad\":12,\"precio\":1000}],\"total\":12000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":12000}]}', '2025-11-21 20:52:43'),
(15, 20, 20, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-22T15:17:22.027Z\",\"vendedor_id\":2,\"items\":[{\"id\":1,\"nombre_producto\":\"Cerveza Corona 330ml\",\"cantidad\":4,\"precio\":\"1300.00\"},{\"id\":2,\"nombre_producto\":\"Cerveza Heineken 330ml\",\"cantidad\":1,\"precio\":\"1400.00\"}],\"total\":6600,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":6600}]}', '2025-11-22 15:17:22'),
(16, 21, 21, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-22T15:43:09.124Z\",\"vendedor_id\":2,\"items\":[{\"id\":10,\"nombre_producto\":\"Cigarro Lucky Strike Box 20\",\"cantidad\":5,\"precio\":\"4000.00\"}],\"total\":20000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":20000}]}', '2025-11-22 15:43:09'),
(17, 22, 22, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-22T16:21:04.784Z\",\"vendedor_id\":2,\"items\":[{\"id\":10,\"nombre_producto\":\"Cigarro Lucky Strike Box 20\",\"cantidad\":6,\"precio\":\"4000.00\"}],\"total\":24000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":24000}]}', '2025-11-22 16:21:04'),
(18, 23, 23, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-22T16:33:05.900Z\",\"vendedor_id\":2,\"items\":[{\"id\":4,\"nombre_producto\":\"Coca-Cola 1.5L\",\"cantidad\":1,\"precio\":\"1500.00\"},{\"id\":5,\"nombre_producto\":\"Sprite 1.5L\",\"cantidad\":1,\"precio\":\"1400.00\"}],\"total\":2900,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":2900}]}', '2025-11-22 16:33:05'),
(19, 24, 24, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-22T16:36:11.159Z\",\"vendedor_id\":2,\"items\":[{\"id\":4,\"nombre_producto\":\"Coca-Cola 1.5L\",\"cantidad\":1,\"precio\":\"1500.00\"},{\"id\":1,\"nombre_producto\":\"Cerveza Corona 330ml\",\"cantidad\":1,\"precio\":\"1300.00\"}],\"total\":2800,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":2800}]}', '2025-11-22 16:36:11'),
(20, 25, 25, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-23T19:33:06.504Z\",\"vendedor_id\":2,\"tipo\":\"NORMAL\",\"items\":[{\"id\":1,\"nombre_producto\":\"Cerveza Corona 330ml\",\"cantidad\":1,\"precio\":\"1300.00\"}],\"total\":1300,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":1300}]}', '2025-11-23 19:33:06'),
(21, 26, 26, '{\"empresa\":\"Botillería CRM\",\"fecha\":\"2025-11-23T19:33:56.515Z\",\"vendedor_id\":1,\"tipo\":\"INTERNA\",\"items\":[{\"id\":8,\"nombre_producto\":\"Pisco Mistral 35° 750ml\",\"cantidad\":1,\"precio\":\"8500.00\"}],\"total\":5000,\"pagos\":[{\"tipo\":\"EFECTIVO\",\"monto\":5000}]}', '2025-11-23 19:33:56');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `alertas_stock`
--
ALTER TABLE `alertas_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `caja_movimientos`
--
ALTER TABLE `caja_movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_mov_caja` (`id_caja_sesion`);

--
-- Indices de la tabla `caja_sesiones`
--
ALTER TABLE `caja_sesiones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_estado` (`estado`);

--
-- Indices de la tabla `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `envases`
--
ALTER TABLE `envases`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `facturas_compra`
--
ALTER TABLE `facturas_compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `facturas_compra_detalle`
--
ALTER TABLE `facturas_compra_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_factura` (`id_factura`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `historial_stock`
--
ALTER TABLE `historial_stock`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `mermas`
--
ALTER TABLE `mermas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `notas_credito_proveedor`
--
ALTER TABLE `notas_credito_proveedor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `id_factura_compra` (`id_factura_compra`);

--
-- Indices de la tabla `ordenes_compra`
--
ALTER TABLE `ordenes_compra`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_proveedor` (`id_proveedor`),
  ADD KEY `id_vendedor_proveedor` (`id_vendedor_proveedor`);

--
-- Indices de la tabla `ordenes_compra_detalle`
--
ALTER TABLE `ordenes_compra_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_orden` (`id_orden`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo_producto` (`codigo_producto`),
  ADD KEY `id_categoria` (`id_categoria`),
  ADD KEY `id_envase` (`id_envase`),
  ADD KEY `id_unidad_capacidad` (`id_unidad_capacidad`),
  ADD KEY `id_proveedor_preferido` (`id_proveedor_preferido`);

--
-- Indices de la tabla `producto_proveedor_precio`
--
ALTER TABLE `producto_proveedor_precio`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_producto` (`id_producto`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `promociones`
--
ALTER TABLE `promociones`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `promociones_detalle`
--
ALTER TABLE `promociones_detalle`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_promocion` (`id_promocion`),
  ADD KEY `idx_producto` (`id_producto`);

--
-- Indices de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `unidades_medida`
--
ALTER TABLE `unidades_medida`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rut_usuario` (`rut_usuario`);

--
-- Indices de la tabla `vendedores_proveedor`
--
ALTER TABLE `vendedores_proveedor`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_proveedor` (`id_proveedor`);

--
-- Indices de la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_usuario` (`id_usuario`);

--
-- Indices de la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_venta` (`id_venta`),
  ADD KEY `id_producto` (`id_producto`);

--
-- Indices de la tabla `ventas_pagos`
--
ALTER TABLE `ventas_pagos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `id_venta` (`id_venta`);

--
-- Indices de la tabla `vouchers`
--
ALTER TABLE `vouchers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id_venta` (`id_venta`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `alertas_stock`
--
ALTER TABLE `alertas_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de la tabla `caja_movimientos`
--
ALTER TABLE `caja_movimientos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `caja_sesiones`
--
ALTER TABLE `caja_sesiones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `envases`
--
ALTER TABLE `envases`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `facturas_compra`
--
ALTER TABLE `facturas_compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `facturas_compra_detalle`
--
ALTER TABLE `facturas_compra_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `historial_stock`
--
ALTER TABLE `historial_stock`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=60;

--
-- AUTO_INCREMENT de la tabla `mermas`
--
ALTER TABLE `mermas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `notas_credito_proveedor`
--
ALTER TABLE `notas_credito_proveedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ordenes_compra`
--
ALTER TABLE `ordenes_compra`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `ordenes_compra_detalle`
--
ALTER TABLE `ordenes_compra_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `productos`
--
ALTER TABLE `productos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `producto_proveedor_precio`
--
ALTER TABLE `producto_proveedor_precio`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de la tabla `promociones`
--
ALTER TABLE `promociones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `promociones_detalle`
--
ALTER TABLE `promociones_detalle`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `proveedores`
--
ALTER TABLE `proveedores`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `unidades_medida`
--
ALTER TABLE `unidades_medida`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `vendedores_proveedor`
--
ALTER TABLE `vendedores_proveedor`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `ventas`
--
ALTER TABLE `ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=79;

--
-- AUTO_INCREMENT de la tabla `ventas_pagos`
--
ALTER TABLE `ventas_pagos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT de la tabla `vouchers`
--
ALTER TABLE `vouchers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `alertas_stock`
--
ALTER TABLE `alertas_stock`
  ADD CONSTRAINT `alertas_stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `caja_movimientos`
--
ALTER TABLE `caja_movimientos`
  ADD CONSTRAINT `fk_mov_caja` FOREIGN KEY (`id_caja_sesion`) REFERENCES `caja_sesiones` (`id`);

--
-- Filtros para la tabla `facturas_compra`
--
ALTER TABLE `facturas_compra`
  ADD CONSTRAINT `facturas_compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`);

--
-- Filtros para la tabla `facturas_compra_detalle`
--
ALTER TABLE `facturas_compra_detalle`
  ADD CONSTRAINT `facturas_compra_detalle_ibfk_1` FOREIGN KEY (`id_factura`) REFERENCES `facturas_compra` (`id`),
  ADD CONSTRAINT `facturas_compra_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `historial_stock`
--
ALTER TABLE `historial_stock`
  ADD CONSTRAINT `historial_stock_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `mermas`
--
ALTER TABLE `mermas`
  ADD CONSTRAINT `mermas_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `mermas_ibfk_2` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `notas_credito_proveedor`
--
ALTER TABLE `notas_credito_proveedor`
  ADD CONSTRAINT `notas_credito_proveedor_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `notas_credito_proveedor_ibfk_2` FOREIGN KEY (`id_factura_compra`) REFERENCES `facturas_compra` (`id`);

--
-- Filtros para la tabla `ordenes_compra`
--
ALTER TABLE `ordenes_compra`
  ADD CONSTRAINT `ordenes_compra_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`),
  ADD CONSTRAINT `ordenes_compra_ibfk_2` FOREIGN KEY (`id_vendedor_proveedor`) REFERENCES `vendedores_proveedor` (`id`);

--
-- Filtros para la tabla `ordenes_compra_detalle`
--
ALTER TABLE `ordenes_compra_detalle`
  ADD CONSTRAINT `ordenes_compra_detalle_ibfk_1` FOREIGN KEY (`id_orden`) REFERENCES `ordenes_compra` (`id`),
  ADD CONSTRAINT `ordenes_compra_detalle_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`id_categoria`) REFERENCES `categorias` (`id`),
  ADD CONSTRAINT `productos_ibfk_2` FOREIGN KEY (`id_envase`) REFERENCES `envases` (`id`),
  ADD CONSTRAINT `productos_ibfk_3` FOREIGN KEY (`id_unidad_capacidad`) REFERENCES `unidades_medida` (`id`),
  ADD CONSTRAINT `productos_ibfk_4` FOREIGN KEY (`id_proveedor_preferido`) REFERENCES `proveedores` (`id`);

--
-- Filtros para la tabla `producto_proveedor_precio`
--
ALTER TABLE `producto_proveedor_precio`
  ADD CONSTRAINT `producto_proveedor_precio_ibfk_1` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `producto_proveedor_precio_ibfk_2` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`);

--
-- Filtros para la tabla `promociones_detalle`
--
ALTER TABLE `promociones_detalle`
  ADD CONSTRAINT `fk_producto` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`),
  ADD CONSTRAINT `fk_promocion` FOREIGN KEY (`id_promocion`) REFERENCES `promociones` (`id`) ON DELETE CASCADE;

--
-- Filtros para la tabla `vendedores_proveedor`
--
ALTER TABLE `vendedores_proveedor`
  ADD CONSTRAINT `vendedores_proveedor_ibfk_1` FOREIGN KEY (`id_proveedor`) REFERENCES `proveedores` (`id`);

--
-- Filtros para la tabla `ventas`
--
ALTER TABLE `ventas`
  ADD CONSTRAINT `ventas_ibfk_1` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `ventas_detalles`
--
ALTER TABLE `ventas_detalles`
  ADD CONSTRAINT `ventas_detalles_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`),
  ADD CONSTRAINT `ventas_detalles_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id`);

--
-- Filtros para la tabla `ventas_pagos`
--
ALTER TABLE `ventas_pagos`
  ADD CONSTRAINT `ventas_pagos_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`);

--
-- Filtros para la tabla `vouchers`
--
ALTER TABLE `vouchers`
  ADD CONSTRAINT `vouchers_ibfk_1` FOREIGN KEY (`id_venta`) REFERENCES `ventas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
