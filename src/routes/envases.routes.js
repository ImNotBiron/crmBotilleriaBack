import { Router } from "express";
import {
  getEnvases,
  getEnvaseById,
  createEnvase,
  updateEnvase,
  deleteEnvase
} from "../controllers/envases.controller.js";

const router = Router();

router.get("/", getEnvases);
router.get("/:id", getEnvaseById);
router.post("/", createEnvase);
router.put("/:id", updateEnvase);
router.delete("/:id", deleteEnvase);

export default router;
