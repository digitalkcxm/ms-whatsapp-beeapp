import crypto from 'crypto'

export default class WhatsappInstanceService {
  constructor(logger = console, whatsappInstanceRepo = {}, configService = {}) {
    this.logger = logger
    this.whatsappInstanceRepo = whatsappInstanceRepo
    this.configService = configService
  }

  async create(input = {}, company = {}, companySettings = {}) {
    const instance = await this.whatsappInstanceRepo.findByApiKeyAndCompanySettingsId(input.api_key, companySettings.id)
    if (instance) {
      throw new Error('Instance já existe')
    }

    const config = await this.configService.findById({ id: input.id_config }, companySettings)
    if (!config) {
      throw new Error('Configuração não existe')
    }

    const newInstance = {
      id_company_settings: companySettings.id,
      token: crypto.randomUUID(),
      id_config: input.id_config,
      number: input.number,
      whatsapp_uri: input.whatsapp_uri,
      name: input.name,
      api_key: input.api_key,
      activated: true
    }

    return this.whatsappInstanceRepo.create(newInstance)
  }

  async update(input = {}, company = {}, companySettings = {}) {
    const instance = await this.whatsappInstanceRepo.findByIdAndCompanySettingsId(input.id, companySettings.id)
    if (!instance) {
      throw new Error('Instance não existe')
    }

    if (input.activated !== undefined) {
      instance.activated = input.activated
    }

    return this.whatsappInstanceRepo.update(input.id, instance, companySettings.id)
  }

  async listAll(companySettings = {}) {
    return this.whatsappInstanceRepo.findAllByCompanySettingsId(companySettings.id)
  }

  async listAllByConfig(config = {}, companySettings = {}) {
    return this.whatsappInstanceRepo.findAllByCompanySettingsAndConfig(companySettings.id, config.id)
  }

  async findByToken(token = '') {
    return this.whatsappInstanceRepo.findByToken(token)
  }

  async findByAPIKey(apiKey = '') {
    return this.whatsappInstanceRepo.findByAPIKey(apiKey)
  }

  async findByIdAndCompanySettings(id = '', companySettings = {}) {
    const instance = await this.whatsappInstanceRepo.findByIdAndCompanySettingsId(id, companySettings.id)
    if (!instance) {
      throw new Error('Instance não existe')
    }

    return instance
  }
}
