import EnumProtocolOriginator from "./EnumProtocolOriginator.js";
import EnumProtocolStatus from "./EnumProtocolStatus.js";

export default class Protocol {
  constructor() {
    this.id = null;
    this.instanceId = null;
    this.companySettingsId = null;
    this.phone = "";
    this.phoneInternational = false;
    this.status = EnumProtocolStatus.OPEN;
    this.originator = EnumProtocolOriginator.CUSTOMER;
    this.startedAt = null;
    this.finishedAt = null;
    this.createdAt = null;
    this.updatedAt = null;
  }

  static newIncomingProtocol(instanceId = null, companySettingsId = null, phone = "", phoneInternational = false) {
    const p = new Protocol();
    p.instanceId = instanceId;
    p.companySettingsId = companySettingsId;
    p.phone = phone;
    p.phoneInternational = phoneInternational;
    p.originator = EnumProtocolOriginator.CUSTOMER;
    p.startedAt = new Date();
    return p;
  }

  static newOutgoingProtocol(instanceId = null, companySettingsId = null, phone = "", phoneInternational = false) {
    const p = new Protocol();
    p.instanceId = instanceId;
    p.companySettingsId = companySettingsId;
    p.phone = phone;
    p.phoneInternational = phoneInternational;
    p.originator = EnumProtocolOriginator.PLATFORM;
    p.startedAt = new Date();
    return p;
  }

  finish() {
    if (this.status === EnumProtocolStatus.CLOSED) {
      throw new Error("Protocolo já finalizado");
    }
    this.finishedAt = new Date();
    this.status = EnumProtocolStatus.CLOSED;
  }

  static fromDatabase(data = {}) {
    const p = new Protocol();
    p.id = data.id;
    p.instanceId = data.id_instance;
    p.companySettingsId = data.id_company_settings;
    p.phone = data.phone;
    p.status = data.status;
    p.originator = data.originator;
    p.startedAt = data.started_at;
    p.finishedAt = data.finished_at;
    p.createdAt = data.created_at;
    p.updatedAt = data.updated_at;
    return p;
  }
}
