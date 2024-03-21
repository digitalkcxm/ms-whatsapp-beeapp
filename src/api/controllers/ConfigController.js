import ConfigService from '../../core/services/ConfigService.js'
import WhatsappInstanceService from '../../core/services/WhatsappInstanceService.js'

export default class ConfigController {
  constructor(logger = console, configRepo = {}, whatsappInstanceRepo = {}) {
    this.logger = logger
    this.configRepo = configRepo

    this.configService = new ConfigService(logger, configRepo)
    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepo)
  }

  async create(req, res, next) {
    try {
      const config = await this.configService.create(req.body, req.companySettings)

      res.status(201).json(config)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao criar a config')
      next(err)
    }
  }

  async update(req, res, next) {
    try {
      const config = await this.configService.update({ id: req.params.id, ...req.body }, req.companySettings)

      res.status(200).json(config)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao atualizar a config')
      next(err)
    }
  }

  async findAllConfig(req, res, next) {
    try {
      const config = await this.configService.findAllConfig(req.companySettings)
      res.status(200).json(config)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao listar as config')
      next(err)
    }
  }

  async findById(req, res, next) {
    try {
      const config = await this.configService.findById({ id: req.params.id }, req.companySettings)
      if (config) {
        config.instances = await this.whatsappInstanceService.listAllByConfig(config, req.companySettings)
      }
      res.status(200).json(config)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Ocorreu erro ao buscar a config')
      next(err)
    }
  }
}
