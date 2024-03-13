import CompanySettingsRepository from "../repositories/CompanySettingsRepository.js";

export default async function companySettingsMiddleware(req, res, next, database, logger = console) {
  const companySettingsRepo = new CompanySettingsRepository(database);

  try {
    const companySettings = await companySettingsRepo.findByToken(req.company.token);
    if (!companySettings) {
      logger.error({ data: req.company.token }, "não há company settings para essa company");
      return res.status(404).send({ error: "não há company settings para essa company" });
    }

    req.companySettings = companySettings;
    next();
  } catch (err) {
    logger.error({ err, data: req.company.token }, "Ocorreu erro ao buscar company settings");
    return res.status(500).send({ error: "Ocorreu erro ao buscar company settings" });
  }
}
