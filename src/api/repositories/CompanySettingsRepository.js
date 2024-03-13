export default class CompanySettingsRepository {
  constructor(database = {}) {
    this.database = database;
  }

  async create(companySettings = {}) {
    return this.database("company_settings").insert(companySettings).returning("*");
  }

  async findById(id) {
    return this.database("company_settings").where({ id }).first();
  }

  async findByToken(token = "") {
    return this.database("company_settings").where({ token }).first();
  }

  async update(id, companySettings) {
    return this.database("company_settings").where({ id }).update(companySettings).returning("*");
  }
}
