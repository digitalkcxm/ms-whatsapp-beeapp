import ProtocolService from "../../core/services/ProtocolService.js";
import WhatsappInstanceService from "../../core/services/WhatsappInstanceService.js";

export default class ProtocolController {
  constructor(logger = console, protocolRepository = {}, whatsappInstanceRepository = {}) {
    this.logger = logger;

    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepository);
    this.protocolService = new ProtocolService(protocolRepository);
  }

  async create(req, res, next) {
    try {
      const instance = await this.whatsappInstanceService.findByToken(req.body.instance_token);
      const protocol = await this.protocolService.createOutgoing(req.body, req.companySettings, instance);

      return res.status(201).send(protocol);
    } catch (err) {
      this.logger.error({ err, data: req.body }, "Erro ao criar protocolo");
      next(err);
    }
  }

  async finish(req, res, next) {
    try {
      const protocol = await this.protocolService.finishProtocol(req.body, req.companySettings);

      return res.status(200).send(protocol);
    } catch (err) {
      this.logger.error({ err, data: req.body }, "Erro ao finalizar protocolo");
      next(err);
    }
  }
}
