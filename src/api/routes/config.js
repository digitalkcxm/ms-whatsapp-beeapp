import express from 'express'

import ConfigController from '../controllers/ConfigController.js'
import ConfigRepository from '../repositories/ConfigRepository.js'
import WhatsappInstanceRepository from '../repositories/WhatsappInstancesRepository.js'
import checkCompany from '../middlewares/CompanyMiddleware.js'
import companySettingsMiddleware from '../middlewares/CompanySettingsMiddleware.js'

export default function configRoutes(database = {}, logger = console) {
  const router = express.Router()

  router.use(checkCompany)
  router.use((req, res, next) => companySettingsMiddleware(req, res, next, database))

  const configRepo = new ConfigRepository(database, logger)
  const whatsappInstanceRepo = new WhatsappInstanceRepository(database, logger)
  const configController = new ConfigController(logger, configRepo, whatsappInstanceRepo)

  router.post('/', (req, res, next) => configController.create(req, res, next))
  router.get('/', (req, res, next) => configController.findAllConfig(req, res, next))
  router.get('/:id', (req, res, next) => configController.findById(req, res, next))
  router.put('/:id', (req, res, next) => configController.update(req, res, next))

  return router
}
