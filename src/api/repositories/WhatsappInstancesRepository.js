export default class WhatsappInstanceRepository {
  constructor(database = {}, logger = console) {
    this.database = database
    this.logger = logger
  }

  async create(instance = {}) {
    return this.database('instances').insert(instance).returning('*')
  }

  async update(id = 0, instance = {}, companySettingsId = 0) {
    return this.database('instances').where({ id, id_company_settings: companySettingsId }).update({ activated: instance.activated }).returning('*')
  }

  async findAllByCompanySettingsId(id) {
    return this.database('instances').where({ id_company_settings: id }).select('*')
  }

  async findAllByCompanySettingsAndConfig(companySettingsId = 0, configId = 0) {
    return this.database('instances').where({ id_company_settings: companySettingsId, id_config: configId, activated: true }).select('*')
  }

  async findByToken(token) {
    const instance = await this.database('instances').where({ token }).first()
    if (!instance) {
      throw new Error('Instance não existe')
    }

    return instance
  }

  async findByAPIKey(apiKey = '') {
    const instance = await this.database('instances').select('instances.*', 'configs.start_department_id').where({ 'instances.api_key': apiKey }).leftJoin('configs', 'instances.id_config', 'configs.id').first()
    if (!instance) {
      throw new Error('Instance não existe')
    }

    return instance
  }

  async findByApiKeyAndCompanySettingsId(apiKey, id) {
    return this.database('instances').where({ api_key: apiKey, id_company_settings: id }).first()
  }

  async findByIdAndCompanySettingsId(instanceId, companySettingsId) {
    return this.database('instances').where({ id: instanceId, id_company_settings: companySettingsId }).first()
  }
}
