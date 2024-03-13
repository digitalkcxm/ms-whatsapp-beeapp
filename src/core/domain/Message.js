import EnumMessageContentType from './EnumMessageContentType.js'
import EnumMessageSource from './EnumMessageSource.js'
import EnumMessageStatus from './EnumMessageStatus.js'
import EnumMessageType from './EnumMessageType.js'

export default class Message {
  constructor() {
    this.id = null
    this.companySettingsId = null
    this.instanceId = null
    this.protocolId = null
    this.messageWhatsappId = null
    this.messageCoreId = null
    this.content = null
    this.type = EnumMessageType.COMMON
    this.contentType = EnumMessageContentType.TEXT
    this.status = EnumMessageStatus.SENT
    this.errorReason = null
    this.source = EnumMessageSource.CUSTOMER
    this.brokerCreatedAt = null
    this.createdAt = null
    this.updatedAt = null
  }

  static newOutgoing(companySettingsId, instanceId, protocolId, messageCoreId, content, type, contentType) {
    const message = new Message()
    message.companySettingsId = companySettingsId
    message.instanceId = instanceId
    message.protocolId = protocolId
    message.messageCoreId = messageCoreId
    message.content = content
    message.type = type
    message.contentType = contentType
    message.source = EnumMessageSource.PLATFORM
    message.status = EnumMessageStatus.SENT
    message.brokerCreatedAt = new Date()

    message._validateContent()

    return message
  }

  static newIncoming(companySettingsId, instanceId, protocolId, messageWhatsappId, content, type, contentType, brokerCreatedAt = '') {
    const message = new Message()

    message.companySettingsId = companySettingsId
    message.instanceId = instanceId
    message.protocolId = protocolId
    message.messageWhatsappId = messageWhatsappId
    message.content = content
    message.type = type ? type.toUpperCase() : EnumMessageType.COMMON
    message.contentType = contentType ? contentType.toUpperCase() : EnumMessageContentType.TEXT
    message.source = EnumMessageSource.CUSTOMER
    message.status = EnumMessageStatus.RECEIVED
    message.brokerCreatedAt = brokerCreatedAt

    message._validateContent()

    return message
  }

  _validateContent() {
    if (!this.content) {
      throw new Error('o conteúdo da mensagem não foi preenchido')
    }
    if (this.isTextMessage() && !this.content?.text) {
      throw new Error('o conteúdo da mensagem deve ser informado no campo text')
    }
  }

  isMessageCommon() {
    return this.type === EnumMessageType.COMMON
  }

  isTextMessage() {
    return this.contentType === EnumMessageContentType.TEXT
  }

  setStatusDeliveredBroker() {
    this.status = EnumMessageStatus.DELIVERED_BROKER
  }

  setStatusDeliveredCustomer() {
    this.status = EnumMessageStatus.DELIVERED_CUSTOMER
  }

  setStatusRead() {
    this.status = EnumMessageStatus.READ
  }

  static fromDatabase(data = {}) {
    const message = new Message()
    message.id = data.id
    message.companySettingsId = data.id_company_settings
    message.instanceId = data.id_instance
    message.protocolId = data.id_protocol
    message.messageWhatsappId = data.id_message_whatsapp
    message.messageCoreId = data.id_message_core
    message.content = data.content
    message.type = data.type
    message.contentType = data.content_type
    message.status = data.status
    message.errorReason = data.error_reason
    message.source = data.source
    message.createdAt = data.created_at
    message.updatedAt = data.updated_at
    message.brokerCreatedAt = data.broker_created_at

    return message
  }
}
