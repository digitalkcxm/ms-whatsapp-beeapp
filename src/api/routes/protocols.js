import express from "express";
import checkCompany from "../middlewares/CompanyMiddleware.js";
import companySettingsMiddleware from "../middlewares/CompanySettingsMiddleware.js";
import WhatsappInstanceRepository from "../repositories/WhatsappInstancesRepository.js";
import WhatsappInstanceController from "../controllers/WhatsappInstanceController.js";
import ProtocolRepository from "../repositories/ProtocolRepository.js";
import ProtocolController from "../controllers/ProtocolController.js";

export default function protocolRoutes(database, logger = console) {
  const router = express.Router();

  router.use(checkCompany);
  router.use((req, res, next) => companySettingsMiddleware(req, res, next, database));

  const whatsappInstanceRepo = new WhatsappInstanceRepository(database, logger);
  const protocolRepository = new ProtocolRepository(database, logger);
  const protocolController = new ProtocolController(logger, protocolRepository, whatsappInstanceRepo);

  router.post("/", (req, res, next) => protocolController.create(req, res, next));
  router.put("/", (req, res, next) => protocolController.finish(req, res, next));

  return router;
}
