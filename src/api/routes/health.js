import express from "express";
import HealthController from "../controllers/HealthController.js";

export default function healthRoutes() {
  const router = express.Router();

  const healthController = new HealthController();

  router.get("", (req, res, next) => healthController.checkHealth(req, res, next));

  return router;
}
