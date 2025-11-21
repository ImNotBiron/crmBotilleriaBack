import { Router } from "express";
import { crearVenta, getHistorialVentas,getResumenVendedores,getVentaById  } from "../controllers/ventas.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const router = Router();

// POST /api/ventas -> Crear venta (POS)
router.post("/", requireAuth, crearVenta);

// ✅ GET /api/ventas -> Obtener historial (Dashboard y Reportes)
router.get("/", requireAuth, getHistorialVentas);

router.get("/dashboard-vendedores", requireAuth, getResumenVendedores);
router.get("/:id", requireAuth, getVentaById);

export default router;