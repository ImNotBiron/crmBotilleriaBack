import { Router } from "express";
import {
  getAlertas,
  getAlertasPendientes,
  getAlertasResueltas,
  resolverAlerta,
  deleteAlerta
} from "../controllers/alertas.controller.js";

const router = Router();

router.get("/", getAlertas);
router.get("/pendientes", getAlertasPendientes);
router.get("/resueltas", getAlertasResueltas);
router.patch("/:id/resolver", resolverAlerta);
router.delete("/:id", deleteAlerta);

export default router;
