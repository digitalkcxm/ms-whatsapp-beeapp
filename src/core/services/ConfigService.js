import crypto from 'crypto'
export default class ConfigService {
  constructor(logger = console, configRepo = {}) {
    this.logger = logger
    this.configRepo = configRepo
  }

  async findById(input = {}, companySettings = {}) {
    return this.configRepo.findByIdAndCompanySettings(input.id, companySettings.id)
  }

  async findByToken(input = {}, companySettings = {}) {
    return this.configRepo.findByTokenAndCompanySettings(input.token, companySettings.id)
  }

  async findAllConfig(companySettings = {}) {
    return this.configRepo.findByCompanySettings(companySettings.id)
  }

  async create(input = {}, companySettings = {}) {
    const config = await this.configRepo.findByNameAndCompanySettings(input.name, companySettings.id)
    if (config?.length) {
      throw new Error('Configuração já existe')
    }

    const newConfig = {
      id_company_settings: companySettings.id,
      name: input.name,
      token: crypto.randomUUID(),
      start_department_id: input.start_department_id ? input.start_department_id : 1
    }

    return this.configRepo.create(newConfig)
  }

  async update(input = {}, companySettings = {}) {
    const configStored = await this.configRepo.findByIdAndCompanySettings(input.id, companySettings.id)
    if (!configStored) {
      throw new Error('Configuração não existe')
    }

    const config = await this.configRepo.findByNameAndCompanySettings(input.name, companySettings.id)
    if (config?.filter((c) => c.id !== parseInt(input.id))?.length) {
      throw new Error('Configuração já existe com este name')
    }

    if (input.start_department_id) {
      configStored.start_department_id = input.start_department_id
    }

    if (input.name) {
      configStored.name = input.name
    }

    if (input.activated !== undefined) {
      configStored.activated = input.activated
    }

    return this.configRepo.update(input.id, configStored, companySettings.id)
  }
}
