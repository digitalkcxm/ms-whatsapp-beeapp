import Message from '../../core/domain/Message.js'
import QueueIntegration from './QueueIntegration.js'

export default class CoreIntegration {
  constructor(httpClient = {}, logger = console) {
    this.httpClient = httpClient
    this.logger = logger
    this.queueIntegration = new QueueIntegration(logger)
  }

  async sendIncoming(company = {}, instance = {}, protocol = {}, message = new Message()) {
    try {
      const payload = {
        id: message.id,
        instance: {
          token: instance.token,
          start_department_id: 1
        },
        chat: {
          id: protocol.id,
          phone: protocol.phone
        },
        message: {
          type: message.type,
          content_type: message.contentType,
          content: message.content,
          broker_created_at: message.brokerCreatedAt
        },
        broker: 'beeapp'
      }
      const event = {
        event: 'incoming_message',
        company_token: company.token,
        channel: 'whatsapp',
        payload
      }
      console.log('event', event)
      const queueName = `mschannels:events:${company.token}`
      return this.queueIntegration.sendToQueue(event, queueName)
    } catch (err) {
      this.logger.error({ err, data: { company, message, protocol, instance } }, 'erro ao enviar mensagem para o core')
      throw new Error('erro ao enviar mensagem para o core')
    }
  }

  async sendUpdateStatus(company = {}, instance = {}, protocol = {}, message = new Message()) {
    try {
      const payload = {
        id: message.id,
        instance: {
          token: instance.token
        },
        chat: {
          id: protocol.id
        },
        payload: {
          id: message.id,
          status: message.status,
          id_message_core: message.messageCoreId
        },
        broker: 'beeapp'
      }
      const event = {
        event: 'update_message_status',
        company_token: company.token,
        channel: 'whatsapp',
        payload
      }
      const queueName = `mschannels:events:${company.token}`

      return this.queueIntegration.sendToQueue(event, queueName)
    } catch (err) {
      this.logger.error({ err, data: { company, message, protocol, instance } }, 'erro ao enviar status da mensagem para o core')
      throw new Error('erro ao enviar status da mensagem para o core')
    }
  }
}
