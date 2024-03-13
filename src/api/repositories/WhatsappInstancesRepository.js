export default class WhatsappInstanceRepository {
  constructor(database = {}, logger = console) {
    this.database = database;
    this.logger = logger;
  }

  async create(instance = {}) {
    return this.database("instances").insert(instance).returning("*");
  }

  async findAllByCompanySettingsId(id) {
    return this.database("instances").where({ id_company_settings: id }).select("*");
  }

  async findByToken(token) {
    const instance = await this.database("instances").where({ token }).first();
    if (!instance) {
      throw new Error("Instance não existe");
    }

    return instance;
  }

  async findByAPIKey(apiKey = "") {
    const instance = await this.database("instances").where({ api_key: apiKey }).first();
    if (!instance) {
      throw new Error("Instance não existe");
    }

    return instance;
  }

  async findByApiKeyAndCompanySettingsId(apiKey, id) {
    return this.database("instances").where({ api_key: apiKey, id_company_settings: id }).first();
  }
}
