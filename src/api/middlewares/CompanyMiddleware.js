import axios from "axios";

import CompanyIntegration from "../integration/company/CompanyIntegration.js";

export default async function checkCompany(req, res, next) {
  const companyIntegration = new CompanyIntegration(axios);

  try {
    const company = await companyIntegration.getCompanyByToken(req.headers.authorization);

    req.company = company;

    next();
  } catch (err) {
    console.error({ err, data: { authorization: req.headers.authorization } }, "Ocorreu erro ao validar a company");
    return res.status(500).send({ error: "Ocorreu erro ao validar a company" });
  }
}
