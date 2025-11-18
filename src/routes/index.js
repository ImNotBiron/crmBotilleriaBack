import { Router } from "express";

import authRoutes from "./auth.routes.js";
import productosRoutes from "./productos.routes.js";
import usuariosRoutes from "./usuarios.routes.js";
import ventasRoutes from "./ventas.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/productos", productosRoutes);
router.use("/usuarios", usuariosRoutes);
router.use("/ventas", ventasRoutes);

export default router;
