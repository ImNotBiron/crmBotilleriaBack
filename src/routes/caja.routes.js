import { Router } from "express";
import { abrirCaja, getEstadoCaja, cerrarCaja } from "../controllers/caja.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// Todas protegidas (solo admin debería usarlas, pero validamos en front)
router.post("/abrir", requireAuth, abrirCaja);
router.get("/estado", requireAuth, getEstadoCaja);
router.post("/cerrar", requireAuth, cerrarCaja);

export default router;