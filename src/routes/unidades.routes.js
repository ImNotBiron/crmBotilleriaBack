import { Router } from "express";
import {
  getUnidades,
  getUnidadById,
  createUnidad,
  updateUnidad,
  deleteUnidad
} from "../controllers/unidades.controller.js";

const router = Router();

router.get("/", getUnidades);
router.get("/:id", getUnidadById);
router.post("/", createUnidad);
router.put("/:id", updateUnidad);
router.delete("/:id", deleteUnidad);

export default router;
