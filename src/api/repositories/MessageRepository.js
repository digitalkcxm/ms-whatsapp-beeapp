import Message from "../../core/domain/Message.js";

export default class MessageRepository {
  constructor(database = {}, logger = console) {
    this.database = database;
    this.logger = logger;
  }

  async createMessage(message = new Message()) {
    const newMessage = {
      id_company_settings: message.companySettingsId,
      id_instance: message.instanceId,
      id_protocol: message.protocolId,
      id_message_core: message.messageCoreId,
      id_message_whatsapp: message.messageWhatsappId,
      content: message.content,
      type: message.type,
      content_type: message.contentType,
      status: message.status,
      error_reason: message.errorReason,
      source: message.source,
    };
    const result = await this.database("messages").insert(newMessage).returning("*");

    return Message.fromDatabase(result[0]);
  }

  async updateMessage(id = "", message = new Message()) {
    const updatedMessage = {
      status: message.status,
      error_reason: message.errorReason,
    };
    const result = await this.database("messages").where({ id }).update(updatedMessage).returning("*");

    return Message.fromDatabase(result[0]);
  }

  async findByWhatsappIdAndCompanySettingsId(messageWhatsappId, companySettingsId) {
    const result = await this.database("messages").where({ id_message_whatsapp: messageWhatsappId, id_company_settings: companySettingsId }).first();

    return Message.fromDatabase(result);
  }
}
