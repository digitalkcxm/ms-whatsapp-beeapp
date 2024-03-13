import Protocol from "../domain/Protocol.js";

export default class ProtocolService {
  constructor(protocolRepository = {}) {
    this.protocolRepository = protocolRepository;
  }

  async createIncoming(input = {}, companySettings = {}, instance = {}) {
    const protocolExist = await this.protocolRepository.getOpenProtocolByPhoneAndInstanceAndCompanySettings(input.phone, instance.id, companySettings.id);
    if (protocolExist) {
      return this._formatProtocol(protocolExist);
    }

    const protocol = Protocol.newIncomingProtocol(instance.id, companySettings.id, input.phone);

    const protocolCreated = await this.protocolRepository.createProtocol(protocol);

    return this._formatProtocol(protocolCreated);
  }

  async createOutgoing(input = {}, companySettings = {}, instance = {}) {
    const protocolExist = await this.protocolRepository.getOpenProtocolByPhoneAndInstanceAndCompanySettings(input.phone, instance.id, companySettings.id);
    if (protocolExist) {
      return this._formatProtocol(protocolExist);
    }

    const protocol = Protocol.newOutgoingProtocol(instance.id, companySettings.id, input.phone);

    const protocolCreated = await this.protocolRepository.createProtocol(protocol);

    return this._formatProtocol(protocolCreated);
  }

  async finishProtocol(input = {}, companySettings = {}) {
    const protocol = await this.protocolRepository.getProtocolByIdAndCompanySettings(input.id, companySettings.id);
    if (!protocol) {
      throw new Error("protocol não existe");
    }

    protocol.finish();

    const protocolUpdated = await this.protocolRepository.updateProtocol(protocol.id, protocol);

    return this._formatProtocol(protocolUpdated);
  }

  async getProtocolById(id, companySettings = {}) {
    return this.protocolRepository.getProtocolByIdAndCompanySettings(id, companySettings.id);
  }

  async getOpenProtocolByPhoneAndInstanceAndCompanySettings(phone, instance, companySettings = {}) {
    return this.protocolRepository.getOpenProtocolByPhoneAndInstanceAndCompanySettings(phone, instance.id, companySettings.id);
  }

  _formatProtocol(protocol = new Protocol()) {
    return {
      id: protocol.id,
      phone: protocol.phone,
      status: protocol.status,
      originator: protocol.originator,
      started_at: protocol.startedAt,
      created_at: protocol.createdAt,
      updated_at: protocol.updatedAt,
    };
  }
}
