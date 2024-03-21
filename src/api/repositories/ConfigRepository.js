export default class ConfigRepository {
  constructor(database = {}, logger = console) {
    this.database = database
    this.logger = logger
  }

  async create(newConfig = {}) {
    return await this.database('configs').insert(newConfig).returning('*')
  }

  async update(id = 0, config = {}, companySettingsId = 0) {
    const configUpdate = {
      name: config.name,
      start_department_id: config.start_department_id,
      activated: config.activated
    }
    return await this.database('configs').where({ id, id_company_settings: companySettingsId }).update(configUpdate).returning('*')
  }

  async findByIdAndCompanySettings(id = 0, companySettingsId = 0) {
    return await this.database('configs').where({ id, id_company_settings: companySettingsId }).first()
  }

  async findByTokenAndCompanySettings(token = 0, companySettingsId = 0) {
    return await this.database('configs').where({ token, id_company_settings: companySettingsId }).first()
  }

  async findByNameAndCompanySettings(name = '', companySettingsId = 0) {
    return await this.database('configs').where({ name, id_company_settings: companySettingsId })
  }

  async findByCompanySettings(companySettingsId = 0) {
    return await this.database('configs').where({ id_company_settings: companySettingsId })
  }
}
