import express from "express";
import checkCompany from "../middlewares/CompanyMiddleware.js";
import CompanySettingsRepository from "../repositories/CompanySettingsRepository.js";
import CompanySettingsController from "../controllers/CompanySettingsController.js";

export default function companySettingsRoutes(database) {
  const router = express.Router();

  router.use(checkCompany);

  const companySettingsRepo = new CompanySettingsRepository(database);
  const companySettingsController = new CompanySettingsController(console, companySettingsRepo);

  router.post("/", (req, res, next) => companySettingsController.create(req, res, next));

  return router;
}
