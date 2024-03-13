import express from "express";
import checkCompany from "../middlewares/CompanyMiddleware.js";
import companySettingsMiddleware from "../middlewares/CompanySettingsMiddleware.js";
import WhatsappInstanceRepository from "../repositories/WhatsappInstancesRepository.js";
import WhatsappInstanceController from "../controllers/WhatsappInstanceController.js";

export default function whatsappInstanceRoutes(database, logger = console) {
  const router = express.Router();

  router.use(checkCompany);
  router.use((req, res, next) => companySettingsMiddleware(req, res, next, database));

  const whatsappInstanceRepo = new WhatsappInstanceRepository(database, logger);
  const whatsappInstanceController = new WhatsappInstanceController(logger, whatsappInstanceRepo);

  router.post("/", (req, res, next) => whatsappInstanceController.create(req, res, next));
  router.get("/", (req, res, next) => whatsappInstanceController.findAll(req, res, next));

  return router;
}
