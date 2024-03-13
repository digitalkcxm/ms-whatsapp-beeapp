export default class CompanySettingsService {
  constructor(csRepo = {}) {
    this.csRepo = csRepo;
  }

  async create(input = {}) {
    const newCs = {
      token: input.token,
    };
    return this.csRepo.create(newCs);
  }
}
