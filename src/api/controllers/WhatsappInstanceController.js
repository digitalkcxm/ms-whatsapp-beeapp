import WhatsappInstanceService from '../../core/services/WhatsappInstanceService.js'
import ConfigService from '../../core/services/ConfigService.js'

export default class WhatsappInstanceController {
  constructor(logger = console, whatsappInstanceRepo = {}, configRepo = {}) {
    this.logger = logger
    this.whatsappInstanceRepo = whatsappInstanceRepo

    const configService = new ConfigService(logger, configRepo)
    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepo, configService)
  }

  async create(req, res, next) {
    try {
      const instance = await this.whatsappInstanceService.create(req.body, req.company, req.companySettings)
      res.status(201).json(instance)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao criar instância')
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const instance = await this.whatsappInstanceService.update({ id: req.params.id, ...req.body }, req.company, req.companySettings)
      res.status(201).json(instance)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao atualizar a instância')
      next(err)
    }
  }

  async findAll(req, res, next) {
    try {
      const instances = await this.whatsappInstanceService.listAll(req.companySettings)
      res.status(200).json(instances)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao listar as instâncias')
      next(err)
    }
  }

  async findById(req, res, next) {
    try {
      const instances = await this.whatsappInstanceService.findByIdAndCompanySettings(req.params.id, req.companySettings)
      res.status(200).json(instances)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao buscar a instância')
      next(err)
    }
  }
}
