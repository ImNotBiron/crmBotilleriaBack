import { Router } from "express";
import { crearVenta } from "../controllers/ventas.controller.js";

const router = Router();

// POST /api/ventas
router.post("/", crearVenta);

export default router;
