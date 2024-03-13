import crypto from "crypto";

export default class WhatsappInstanceService {
  constructor(logger = console, whatsappInstanceRepo = {}) {
    this.logger = logger;
    this.whatsappInstanceRepo = whatsappInstanceRepo;
  }

  async create(input = {}, company = {}, companySettings = {}) {
    console.log(input.api_key, companySettings.id);
    const instance = await this.whatsappInstanceRepo.findByApiKeyAndCompanySettingsId(input.api_key, companySettings.id);
    if (instance) {
      throw new Error("Instance já existe");
    }

    const newInstance = {
      id_company_settings: companySettings.id,
      token: crypto.randomUUID(),
      number: input.number,
      whatsapp_uri: input.whatsapp_uri,
      name: input.name,
      api_key: input.api_key,
      activated: true,
    };

    return this.whatsappInstanceRepo.create(newInstance);
  }

  async listAll(companySettings = {}) {
    return this.whatsappInstanceRepo.findAllByCompanySettingsId(companySettings.id);
  }

  async findByToken(token = "") {
    return this.whatsappInstanceRepo.findByToken(token);
  }

  async findByAPIKey(apiKey = "") {
    return this.whatsappInstanceRepo.findByAPIKey(apiKey);
  }
}
