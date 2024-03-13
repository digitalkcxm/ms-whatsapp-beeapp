import MessageService from "../../core/services/MessageService.js";
import WhatsappInstanceService from "../../core/services/WhatsappInstanceService.js";
import RabbitMQ from "../config/rabbitmq.js";
import DownloaderFile from "../helpers/DownloaderFile.js";
import S3Integration from "../integration/S3Integration.js";

export default class MessageController {
  constructor(logger = console, messageRepo = {}, protocolRepo = {}, whatsappInstanceRepo = {}, companySettingsRepo = {}, brokerIntegration = {}, coreIntegration = {}, companyIntegration = {}) {
    this.logger = logger;

    this.companySettingsRepo = companySettingsRepo;
    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepo);

    this.messageService = new MessageService(logger, messageRepo, protocolRepo, brokerIntegration, coreIntegration, DownloaderFile.newInstance(), S3Integration.newInstance());
    this.companyIntegration = companyIntegration;
  }

  async createOutgoingMessage(body, company = {}, companySettings = {}) {
    try {
      const instance = await this.whatsappInstanceService.findByToken(body.instance_token);

      const message = await this.messageService.createOutgoingMessage(body, companySettings, instance);

      return { send: true, message };
    } catch (err) {
      this.logger.error({ err, data: { body: req.body } }, "Ocorreu erro ao enviar a mensagem");

      return { send: false, error: err };
    }
  }

  async createIncomingMessage(req, res, next) {
    try {
      const instance = await this.whatsappInstanceService.findByAPIKey(req.body.apikey);

      const companySettings = await this.companySettingsRepo.findById(instance.id_company_settings);
      if (!companySettings) {
        return res.status(404).json({ error: "Company settings não encontradas" });
      }

      const company = await this.companyIntegration.getCompanyByToken(companySettings.token);
      if (!company) {
        return res.status(404).json({ error: "Company não encontrada" });
      }

      if (req.body.event === "messages.upsert") {
        const message = await this.messageService.createIncomingMessage(req.body, companySettings, instance, company);

        return res.status(201).json(message);
      }

      await this.messageService.handleMessageEvent(req.body, companySettings, instance, company);

      return res.status(200).json({ status: "ok" });
    } catch (err) {
      this.logger.error({ err, data: { body: req.body } });
      return res.status(500).json({ error: "Ocorreu erro ao enviar a mensagem" });
    }
  }

  async queue() {
    try {
      const ch = await RabbitMQ.newChannel();

      const queueName = `mswhatsappbeeapp:events`;

      ch.assertQueue(queueName, { durable: true });
      ch.prefetch(1);

      ch.consume(
        queueName,
        async (msg) => {
          const data = JSON.parse(msg.content.toString());
          console.log("data", data);

          if (data.event === "send_message") {
            const companySettings = await this.companySettingsRepo.findByToken(data.company_token);
            if (!companySettings) {
              this.logger.error({ data }, "Company settings não encontradas");
              ch.ack(msg);
              return;
            }

            const company = await this.companyIntegration.getCompanyByToken(data.company_token);
            if (!company) {
              this.logger.error({ data }, "Company não encontrada");
              ch.ack(msg);
              return;
            }

            const result = await this.createOutgoingMessage(data.payload, company, companySettings);
            if (result.send) {
              ch.ack(msg);
            } else {
              ch.reject(msg);
            }
          }
        },
        { noAck: false }
      );
    } catch (err) {
      this.logger.error({ err }, "Error on queue");
      return err;
    }
  }
}
