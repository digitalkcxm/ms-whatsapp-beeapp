import WhatsappInstanceService from "../../core/services/WhatsappInstanceService.js";

export default class WhatsappInstanceController {
  constructor(logger = console, whatsappInstanceRepo = {}) {
    this.logger = logger;
    this.whatsappInstanceRepo = whatsappInstanceRepo;

    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepo);
  }

  async create(req, res, next) {
    try {
      const instance = await this.whatsappInstanceService.create(req.body, req.company, req.companySettings);
      res.status(201).json(instance);
    } catch (err) {
      this.logger.error({ err, data: req.body }, "Ocorreu erro ao criar instância");
      next(err);
    }
  }

  async findAll(req, res, next) {
    try {
      const instances = await this.whatsappInstanceService.listAll(req.companySettings);
      res.status(200).json(instances);
    } catch (err) {
      this.logger.error({ err, data: req.body }, "Ocorreu erro ao buscar instâncias");
      next(err);
    }
  }
}
