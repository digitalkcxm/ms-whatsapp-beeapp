import AppVariables from "../../config/AppVariables.js";

export default class CompanyIntegration {
  constructor(httpClient = {}, logger = console) {
    this.httpClient = httpClient;
    this.logger = logger;
  }

  async getCompanyByToken(token = "") {
    try {
      const instance = this.#createInstance();
      const result = await instance.get(`/company/token/${token}`);
      return result.data;
    } catch (err) {
      this.logger.error({ err, data: { token } }, "ocorreu erro ao buscar a company por token");
      throw new Error("ocorreu erro ao buscar a company por token");
    }
  }

  #createInstance() {
    return this.httpClient.create({
      baseURL: AppVariables.msCompany(),
      timeout: 5000,
    });
  }
}
