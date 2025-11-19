import { Router } from "express";
import {
  getHistorialCompleto,
  getHistorialPorProducto,
  registrarEntrada,
  registrarSalida
} from "../controllers/historial.controller.js";

const router = Router();

router.get("/", getHistorialCompleto);
router.get("/producto/:id_producto", getHistorialPorProducto);
router.post("/entrada", registrarEntrada);
router.post("/salida", registrarSalida);

export default router;
