import AppVariables from '../config/AppVariables.js'
import DownloaderFile from '../helpers/DownloaderFile.js'

import fs from 'fs'

export default class BeeAppIntegration {
  constructor(httpClient = {}, logger = console) {
    this.httpClient = httpClient
    this.logger = logger
  }

  async sendTextMessage(protocol = {}, message = {}, instance = {}) {
    try {
      const payload = {
        number: `${protocol.phone}@s.whatsapp.net`,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false
        },
        textMessage: {
          text: message.content.text
        }
      }
      const client = this._setupClient(instance)
      const url = `/message/sendText/${instance.name}`
      const result = await client.post(url, payload)

      return {
        id: result.data.key.id,
        status: result.data.status
      }
    } catch (err) {
      this.logger.error({ err, data: { message } }, 'erro ao enviar mensagem para o BeepApp')
      throw new Error('erro ao enviar mensagem para o BeepApp')
    }
  }

  async sendDocument(protocol = {}, message = {}, instance = {}) {
    try {
      const payload = {
        number: `${protocol.phone}@s.whatsapp.net`,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false
        },
        mediaMessage: {
          mediatype: 'document',
          fileName: message.content.filename,
          media: message.content.url,
          caption: message.content?.text
        }
      }
      const client = this._setupClient(instance)
      const url = `/message/sendMedia/${instance.name}`
      const result = await client.post(url, payload)

      return {
        id: result.data.key.id,
        status: result.data.status
      }
    } catch (err) {
      console.error(err)
      this.logger.error({ err, data: { message } }, 'erro ao enviar documento para o BeepApp')
      throw new Error('erro ao enviar documento para o BeepApp')
    }
  }

  async sendImage(protocol = {}, message = {}, instance = {}) {
    try {
      const payload = {
        number: `${protocol.phone}@s.whatsapp.net`,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false
        },
        mediaMessage: {
          mediatype: 'image',
          media: message.content.url,
          caption: message.content?.text
        }
      }
      const client = this._setupClient(instance)
      const url = `/message/sendMedia/${instance.name}`
      const result = await client.post(url, payload)

      return {
        id: result.data.key.id,
        status: result.data.status
      }
    } catch (err) {
      this.logger.error({ err, data: { message } }, 'erro ao enviar documento para o BeepApp')
      throw new Error('erro ao enviar documento para o BeepApp')
    }
  }

  async sendAudio(protocol = {}, message = {}, instance = {}) {
    try {
      const downloader = DownloaderFile.newInstance()
      const localPath = await downloader.downloadFile(message.content.url, message.content.filename)
      const audioBase64 = Buffer.from(fs.readFileSync(localPath)).toString('base64')
      const payload = {
        number: `${protocol.phone}@s.whatsapp.net`,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false,
          encoding: true
        },
        audioMessage: {
          audio: audioBase64
        }
      }

      const client = this._setupClient(instance)
      const url = `/message/sendWhatsAppAudio/${instance.name}`
      const result = await client.post(url, payload)

      return {
        id: result.data.key.id,
        status: result.data.status
      }
    } catch (err) {
      console.error(err)
      this.logger.error({ err, data: { message } }, 'erro ao enviar audio para o BeepApp')
      throw new Error('erro ao enviar audio para o BeepApp')
    }
  }

  async sendVideo(protocol = {}, message = {}, instance = {}) {
    try {
      const payload = {
        number: `${protocol.phone}@s.whatsapp.net`,
        options: {
          delay: 1200,
          presence: 'composing',
          linkPreview: false
        },
        mediaMessage: {
          mediatype: 'video',
          media: message.content.url,
          caption: message.content?.text
        }
      }
      const client = this._setupClient(instance)
      const url = `/message/sendMedia/${instance.name}`
      const result = await client.post(url, payload)

      return {
        id: result.data.key.id,
        status: result.data.status
      }
    } catch (err) {
      this.logger.error({ err, data: { message } }, 'erro ao enviar documento para o BeepApp')
      throw new Error('erro ao enviar documento para o BeepApp')
    }
  }

  async findAllInstances() {
    try {
      const client = this._setupGlobalClient()
      const url = '/instance/fetchInstances'
      const result = await client.get(url)

      return result.data
    } catch (err) {
      this.logger.error({ err }, 'erro ao buscar instâncias')
      throw new Error('erro ao buscar instâncias')
    }
  }

  _setupClient(instance = new WhatsappInstance()) {
    return this.httpClient.create({
      baseURL: AppVariables.beeAppUrl(),
      headers: {
        apikey: `${instance.api_key}`
      }
    })
  }

  _setupGlobalClient() {
    return this.httpClient.create({
      baseURL: AppVariables.beeAppUrl(),
      headers: {
        apikey: `${AppVariables.beeAppGlobalKey()}`
      }
    })
  }
}
