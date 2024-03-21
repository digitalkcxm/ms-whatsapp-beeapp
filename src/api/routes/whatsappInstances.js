import express from 'express'
import checkCompany from '../middlewares/CompanyMiddleware.js'
import companySettingsMiddleware from '../middlewares/CompanySettingsMiddleware.js'
import WhatsappInstanceRepository from '../repositories/WhatsappInstancesRepository.js'
import ConfigRepository from '../repositories/ConfigRepository.js'
import WhatsappInstanceController from '../controllers/WhatsappInstanceController.js'

export default function whatsappInstanceRoutes(database, logger = console) {
  const router = express.Router()

  router.use(checkCompany)
  router.use((req, res, next) => companySettingsMiddleware(req, res, next, database))

  const configRepo = new ConfigRepository(database, logger)
  const whatsappInstanceRepo = new WhatsappInstanceRepository(database, logger)
  const whatsappInstanceController = new WhatsappInstanceController(logger, whatsappInstanceRepo, configRepo)

  router.post('/', (req, res, next) => whatsappInstanceController.create(req, res, next))
  router.get('/', (req, res, next) => whatsappInstanceController.findAll(req, res, next))
  router.get('/:id', (req, res, next) => whatsappInstanceController.findById(req, res, next))
  router.put('/:id', (req, res, next) => whatsappInstanceController.update(req, res, next))

  return router
}
