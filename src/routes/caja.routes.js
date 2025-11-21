import { Router } from "express";
import { abrirCaja, getEstadoCaja, cerrarCaja, registrarMovimiento } from "../controllers/caja.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/abrir", requireAuth, abrirCaja);
router.get("/estado", requireAuth, getEstadoCaja);
router.post("/cerrar", requireAuth, cerrarCaja);
router.post("/movimiento", requireAuth, registrarMovimiento);

export default router;