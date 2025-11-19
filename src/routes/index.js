import { Router } from "express";

import authRoutes from "./auth.routes.js";
import productosRoutes from "./productos.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import ventasRoutes from "./ventas.routes.js";
import proveedoresRoutes from "./proveedores.routes.js";
import categoriasRoutes from "./categorias.routes.js";
import envasesRoutes from "./envases.routes.js";
import unidadesRoutes from "./unidades.routes.js";
import alertasRoutes from "./alertas.routes.js";
import historialRoutes from "./historial.routes.js";
import promocionesRoutes from "./promociones.routes.js";



const router = Router();

router.use("/auth", authRoutes);
router.use("/productos", productosRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/ventas", ventasRoutes);
router.use("/proveedores", proveedoresRoutes);
router.use("/categorias", categoriasRoutes);
router.use("/envases", envasesRoutes);
router.use("/unidades-medida", unidadesRoutes);
router.use("/alertas-stock", alertasRoutes);
router.use("/historial-stock", historialRoutes);
router.use("/promociones", promocionesRoutes);

export default router;
