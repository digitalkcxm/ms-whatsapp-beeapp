import Protocol from '../domain/Protocol.js'

export default class ProtocolService {
  constructor(protocolRepository = {}, whatsappInstanceRepository = {}, brokerIntegration = {}) {
    this.protocolRepository = protocolRepository
    this.whatsappInstanceRepository = whatsappInstanceRepository
    this.brokerIntegration = brokerIntegration
  }

  async createIncoming(input = {}, companySettings = {}, instance = {}) {
    const protocolExist = await this.protocolRepository.getOpenProtocolByPhoneAndInstanceAndCompanySettings(input.phone, instance.id, companySettings.id)
    if (protocolExist) {
      return this._formatProtocol(protocolExist)
    }

    const protocol = Protocol.newIncomingProtocol(instance.id, instance.id_config, companySettings.id, input.phone)

    const protocolCreated = await this.protocolRepository.createProtocol(protocol)

    return this._formatProtocol(protocolCreated)
  }

  async createOutgoing(input = {}, companySettings = {}, config = {}) {
    const protocolExist = await this.protocolRepository.getOpenProtocolByPhoneAndConfigAndCompanySettings(input.phone, config.id, companySettings.id)
    if (protocolExist) {
      return this._formatProtocol(protocolExist)
    }

    const instances = await this.whatsappInstanceRepository.findAllByCompanySettingsAndConfig(companySettings.id, config.id)
    if (!instances.length) {
      throw new Error('Não existe instância para o config')
    }

    const instance = await this._getInstance(instances)

    const protocol = Protocol.newOutgoingProtocol(instance.id, config.id, companySettings.id, input.phone)

    const protocolCreated = await this.protocolRepository.createProtocol(protocol)

    return this._formatProtocol(protocolCreated)
  }

  async _getInstance(instances = {}) {
    const remoteInstances = await this.brokerIntegration.findAllInstances()

    const instanceFiltered = instances.filter((i) => remoteInstances.find((ri) => i?.name === ri?.name))
    
    if (!instanceFiltered) {
      throw new Error('Não existe instância disponível')
    }

    return instanceFiltered[Math.floor(Math.random() * instanceFiltered.length)]
  }

  async finishProtocol(input = {}, companySettings = {}) {
    const protocol = await this.protocolRepository.getProtocolByIdAndCompanySettings(input.id, companySettings.id)
    if (!protocol) {
      throw new Error('protocol não existe')
    }

    protocol.finish()

    const protocolUpdated = await this.protocolRepository.updateProtocol(protocol.id, protocol)

    return this._formatProtocol(protocolUpdated)
  }

  async getProtocolById(id, companySettings = {}) {
    return this.protocolRepository.getProtocolByIdAndCompanySettings(id, companySettings.id)
  }

  async getOpenProtocolByPhoneAndInstanceAndCompanySettings(phone, instance, companySettings = {}) {
    return this.protocolRepository.getOpenProtocolByPhoneAndInstanceAndCompanySettings(phone, instance.id, companySettings.id)
  }

  _formatProtocol(protocol = new Protocol()) {
    return {
      id: protocol.id,
      phone: protocol.phone,
      status: protocol.status,
      originator: protocol.originator,
      started_at: protocol.startedAt,
      created_at: protocol.createdAt,
      updated_at: protocol.updatedAt
    }
  }
}
