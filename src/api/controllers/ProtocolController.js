import ConfigService from '../../core/services/ConfigService.js'
import ProtocolService from '../../core/services/ProtocolService.js'
import WhatsappInstanceService from '../../core/services/WhatsappInstanceService.js'

export default class ProtocolController {
  constructor(logger = console, protocolRepository = {}, whatsappInstanceRepository = {}, configRepo = {}, brokerIntegration = {}) {
    this.logger = logger

    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepository)
    this.protocolService = new ProtocolService(protocolRepository, whatsappInstanceRepository, brokerIntegration)
    this.configService = new ConfigService(logger, configRepo)
  }

  async create(req, res, next) {
    try {
      const config = await this.configService.findByToken({ token: req.body.config_token }, req.companySettings)
      if (!config) {
        return res.status(404).send({ message: 'Configuração não encontrada' })
      }
      const protocol = await this.protocolService.createOutgoing(req.body, req.companySettings, config)

      return res.status(201).send(protocol)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Erro ao criar protocolo')
      next(err)
    }
  }

  async finish(req, res, next) {
    try {
      const protocol = await this.protocolService.finishProtocol(req.body, req.companySettings)

      return res.status(200).send(protocol)
    } catch (err) {
      this.logger.error({ err, data: req.body }, 'Erro ao finalizar protocolo')
      next(err)
    }
  }
}
