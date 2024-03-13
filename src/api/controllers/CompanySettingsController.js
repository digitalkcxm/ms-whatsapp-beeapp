export default class CompanySettingsController {
  constructor(logger = console, companySettingsRepo = {}) {
    this.logger = logger;

    this.companySettingsRepo = companySettingsRepo;
  }

  async create(req, res, next) {
    try {
      const cs = await this.companySettingsRepo.findByToken(req.company.token);
      if (cs) {
        return next({ status: 409, message: "Company settings já existe" });
      }

      const companySettings = {
        token: req.company.token,
      };
      const newCompanySettings = this.companySettingsRepo.create(companySettings);
      res.status(201).json(newCompanySettings);
    } catch (err) {
      this.logger.error({ err, data: req.body }, "Ocorreu erro ao criar company settings");
      next(err);
    }
  }
}
