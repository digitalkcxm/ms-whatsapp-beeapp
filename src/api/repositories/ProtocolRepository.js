import EnumProtocolStatus from '../../core/domain/EnumProtocolStatus.js'
import Protocol from '../../core/domain/Protocol.js'

export default class ProtocolRepository {
  constructor(database = {}, logger = console) {
    this.database = database
    this.logger = logger
  }

  async createProtocol(protocol = new Protocol()) {
    const newProtocol = {
      id_config: protocol.configId,
      id_instance: protocol.instanceId,
      id_company_settings: protocol.companySettingsId,
      phone: protocol.phone,
      status: protocol.status,
      originator: protocol.originator,
      started_at: protocol.startedAt
    }
    const result = await this.database('protocols').insert(newProtocol).returning('*')

    return Protocol.fromDatabase(result[0])
  }

  async getProtocolByIdAndCompanySettings(id = '', idCompanySettings = '') {
    const protocol = await this.database('protocols').where({ id, id_company_settings: idCompanySettings }).first()

    if (!protocol) {
      return null
    }

    return Protocol.fromDatabase(protocol)
  }

  async getOpenProtocolByPhoneAndInstanceAndCompanySettings(phone = '', idInstance = '', idCompanySettings = '') {
    const protocol = await this.database('protocols').where({ phone, id_instance: idInstance, id_company_settings: idCompanySettings, status: EnumProtocolStatus.OPEN }).first()

    if (!protocol) {
      return null
    }

    return Protocol.fromDatabase(protocol)
  }

  async getOpenProtocolByPhoneAndConfigAndCompanySettings(phone = '', idConfig = '', idCompanySettings = '') {
    const protocol = await this.database('protocols').where({ phone, id_config: idConfig, id_company_settings: idCompanySettings, status: EnumProtocolStatus.OPEN }).first()

    if (!protocol) {
      return null
    }

    return Protocol.fromDatabase(protocol)
  }

  async updateProtocol(id = '', protocol = new Protocol()) {
    const newProtocol = {
      status: protocol.status,
      finished_at: protocol.finishedAt
    }
    const result = await this.database('protocols').where({ id }).update(newProtocol).returning('*')

    return Protocol.fromDatabase(result[0])
  }
}
