import Message from '../domain/Message.js'
import ProtocolService from './ProtocolService.js'

import { format } from 'date-fns'
import mime from 'mime-types'
import WhatsappInstanceService from './WhatsappInstanceService.js'

export default class MessageService {
  constructor(logger, messageRepo = {}, protocolRepo = {}, brokerIntegration = {}, coreIntegration = {}, downloaderFile = {}, s3Integration = {}, whatsappInstanceRepo = {}) {
    this.logger = logger
    this.messageRepo = messageRepo
    this.brokerIntegration = brokerIntegration
    this.downloaderFile = downloaderFile
    this.s3Integration = s3Integration

    this.protocolService = new ProtocolService(protocolRepo)
    this.whatsappInstanceService = new WhatsappInstanceService(logger, whatsappInstanceRepo)
    this.coreIntegration = coreIntegration
  }

  async createOutgoingMessage(input = {}, companySettings = {}) {
    const protocol = await this.protocolService.getProtocolById(input.protocol_id, companySettings)
    if (!protocol) {
      throw new Error('protocol não existe')
    }

    const instance = await this.whatsappInstanceService.findByIdAndCompanySettings(protocol.instanceId, companySettings)

    const message = Message.newOutgoing(companySettings.id, instance.id, protocol.id, input.message_core_id, input.content, input.type, input.content_type)

    let result
    if (input.content_type === 'FILE') {
      result = await this.brokerIntegration.sendDocument(protocol, message, instance)
    } else if (input.content_type === 'AUDIO') {
      result = await this.brokerIntegration.sendAudio(protocol, message, instance)
    } else if (input.content_type === 'VIDEO') {
      result = await this.brokerIntegration.sendVideo(protocol, message, instance)
    } else if (input.content_type === 'IMAGE') {
      result = await this.brokerIntegration.sendImage(protocol, message, instance)
    } else if (input.content_type === 'TEXT') {
      result = await this.brokerIntegration.sendTextMessage(protocol, message, instance)
    }

    message.messageWhatsappId = result.id

    const messageCreated = await this.messageRepo.createMessage(message)

    return messageCreated
  }

  async createIncomingMessage(input = {}, companySettings = {}, instance = {}, company = {}) {
    const phone = input.data.key.remoteJid.replace('@s.whatsapp.net', '')

    const protocol = await this.protocolService.createIncoming({ phone }, companySettings, instance)

    const messageType = 'COMMON'
    let contentType = 'TEXT'
    let content = {}
    if (input.data.messageType === 'documentMessage') {
      const brokerContent = input.data.message.base64
      const filename = input.data.message.documentMessage.fileName
      const mimetype = input.data.message.documentMessage.mimetype
      const fileSize = input.data.message.documentMessage.fileLength
      const localPath = await this.downloaderFile.downloadBase64(brokerContent, filename)
      const cloudPath = await this.s3Integration.uploadFile(false, `${companySettings.token}/${format(new Date(), 'yyyy-MM-dd')}`, localPath, filename, mimetype, true)
      content = {
        url: cloudPath,
        filename: filename,
        mimetype: mimetype,
        size: fileSize
      }
      contentType = 'FILE'
    } else if (input.data.messageType === 'documentWithCaptionMessage') {
      const brokerContent = input.data.message.base64
      const filename = input.data.message.documentWithCaptionMessage.message.documentMessage.fileName
      const mimetype = input.data.message.documentWithCaptionMessage.message.documentMessage.mimetype
      const fileSize = input.data.message.documentWithCaptionMessage.message.documentMessage.fileLength
      const localPath = await this.downloaderFile.downloadBase64(brokerContent, filename)
      const cloudPath = await this.s3Integration.uploadFile(false, `${companySettings.token}/${format(new Date(), 'yyyy-MM-dd')}`, localPath, filename, mimetype, true)
      const text = input.data.message.documentWithCaptionMessage.message.documentMessage.caption
      content = {
        url: cloudPath,
        filename: filename,
        mimetype: mimetype,
        size: fileSize,
        text
      }
      console.log('content', content)
      contentType = 'FILE'
    } else if (input.data.messageType === 'audioMessage') {
      const brokerContent = input.data.message.base64
      const filename = `${format(new Date(), 'yyyy-MM-dd')}_${input.data.key.id}.ogg`
      const mimetype = input.data.message.audioMessage.mimetype
      const fileSize = input.data.message.audioMessage.fileLength
      const localPath = await this.downloaderFile.downloadBase64(brokerContent, filename)
      const cloudPath = await this.s3Integration.uploadFile(false, `${companySettings.token}/${format(new Date(), 'yyyy-MM-dd')}`, localPath, filename, mimetype, true)
      const text = input.data.message.audioMessage.caption
      content = {
        url: cloudPath,
        filename: filename,
        mimetype: mimetype,
        size: fileSize,
        text
      }
      contentType = 'AUDIO'
    } else if (input.data.messageType === 'videoMessage') {
      const brokerContent = input.data.message.base64
      const filename = `${format(new Date(), 'yyyy-MM-dd')}_${input.data.key.id}.mp4`
      const mimetype = input.data.message.videoMessage.mimetype
      const fileSize = input.data.message.videoMessage.fileLength
      const localPath = await this.downloaderFile.downloadBase64(brokerContent, filename)
      const cloudPath = await this.s3Integration.uploadFile(false, `${companySettings.token}/${format(new Date(), 'yyyy-MM-dd')}`, localPath, filename, mimetype, true)
      const text = input.data.message.videoMessage.caption
      content = {
        url: cloudPath,
        filename: filename,
        mimetype: mimetype,
        size: fileSize,
        text
      }
      contentType = 'VIDEO'
    } else if (input.data.messageType === 'imageMessage') {
      const brokerContent = input.data.message.base64
      const ext = mime.extension(input.data.message.imageMessage.mimetype) || 'jpg'

      const filename = `${format(new Date(), 'yyyy-MM-dd')}_${input.data.key.id}.${ext}`
      const mimetype = input.data.message.imageMessage.mimetype
      const fileSize = input.data.message.imageMessage.fileLength
      const localPath = await this.downloaderFile.downloadBase64(brokerContent, filename)
      const cloudPath = await this.s3Integration.uploadFile(false, `${companySettings.token}/${format(new Date(), 'yyyy-MM-dd')}`, localPath, filename, mimetype, true)
      const text = input.data.message.imageMessage.caption
      content = {
        url: cloudPath,
        filename: filename,
        mimetype: mimetype,
        size: fileSize,
        text
      }
      contentType = 'IMAGE'
    } else {
      content = {
        text: input.data.message.conversation
      }
    }

    const message = Message.newIncoming(companySettings.id, instance.id, protocol.id, input.data.key.id, content, messageType, contentType, input.date_time)

    const messageCreated = await this.messageRepo.createMessage(message)

    console.log('messageCreated', messageCreated)

    this.coreIntegration.sendIncoming(company, instance, protocol, message)

    return messageCreated
  }

  async handleMessageEvent(input = {}, companySettings = {}, instance = {}, company = {}) {
    const messageWhatsappId = input.data?.id ? input.data.id : input.data.key.id

    const message = await this.messageRepo.findByWhatsappIdAndCompanySettingsId(messageWhatsappId, companySettings.id)
    if (!message) {
      throw new Error('message não existe')
    }

    const protocol = await this.protocolService.getProtocolById(message.protocolId, companySettings)

    if (input.event === 'messages.update') {
      if (input.data.status === 'DELIVERY_ACK') {
        message.setStatusDeliveredCustomer()
      } else if (input.data.status === 'READ') {
        message.setStatusRead()
      }
      await this.messageRepo.updateMessage(message.id, message)
      await this.coreIntegration.sendUpdateStatus(company, instance, protocol, message)
    } else if (input.event === 'send.message') {
      message.setStatusDeliveredBroker()
      await this.messageRepo.updateMessage(message.id, message)
      await this.coreIntegration.sendUpdateStatus(company, instance, protocol, message)
    }
  }
}
