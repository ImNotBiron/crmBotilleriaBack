import { Router } from "express";
import { requireAuth } from "../middlewares/auth.middleware.js";
import {
  getPromociones,
  getPromocionesActivas,
  getPromocionById,
  createPromocion,
  updatePromocion,
  updateEstadoPromocion,
  deletePromocion,
} from "../controllers/promociones.controller.js";

const router = Router();

/**
 * Middleware simple para restringir a admin
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.tipo_usuario !== "admin") {
    return res
      .status(403)
      .json({ message: "Solo un usuario admin puede realizar esta acción." });
  }
  next();
};

// 🔹 Listado para ADMIN (todas)
router.get("/", requireAuth, requireAdmin, getPromociones);

// 🔹 Listado para VENDEDOR (solo activas)
router.get("/activas", requireAuth, getPromocionesActivas);

// 🔹 Detalle de una promo
router.get("/:id", requireAuth, getPromocionById);

// 🔹 Crear promo (ADMIN)
router.post("/", requireAuth, requireAdmin, createPromocion);

// 🔹 Editar promo (ADMIN)
router.put("/:id", requireAuth, requireAdmin, updatePromocion);

// 🔹 Cambiar estado activa/on/off (ADMIN)
router.patch("/:id/estado", requireAuth, requireAdmin, updateEstadoPromocion);

// 🔹 Eliminar promo (ADMIN)
router.delete("/:id", requireAuth, requireAdmin, deletePromocion);

export default router;
