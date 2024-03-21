import express from 'express'
import axios from 'axios'

import checkCompany from '../middlewares/CompanyMiddleware.js'
import companySettingsMiddleware from '../middlewares/CompanySettingsMiddleware.js'
import WhatsappInstanceRepository from '../repositories/WhatsappInstancesRepository.js'
import ProtocolRepository from '../repositories/ProtocolRepository.js'
import MessageRepository from '../repositories/MessageRepository.js'
import BeeAppIntegration from '../integration/BeepAppIntegration.js'
import MessageController from '../controllers/MessageController.js'
import CompanySettingsRepository from '../repositories/CompanySettingsRepository.js'
import CoreIntegration from '../integration/CoreIntegration.js'
import CompanyIntegration from '../integration/company/CompanyIntegration.js'
import QueueIntegration from '../integration/QueueIntegration.js'

export default function messageRoutes(database, logger = console) {
  const router = express.Router()

  const whatsappInstanceRepo = new WhatsappInstanceRepository(database, logger)
  const protocolRepository = new ProtocolRepository(database, logger)
  const messageRepository = new MessageRepository(database, logger)
  const companySettingsRepo = new CompanySettingsRepository(database)
  const beeappIntegration = new BeeAppIntegration(axios, logger)
  const coreIntegration = new CoreIntegration(axios, logger)
  const companyIntegration = new CompanyIntegration(axios, logger)
  const queueIntegration = new QueueIntegration(logger)

  const messageController = new MessageController(logger, messageRepository, protocolRepository, whatsappInstanceRepo, companySettingsRepo, beeappIntegration, coreIntegration, companyIntegration, queueIntegration)

  router.post('/incoming', (req, res, next) => messageController.createIncomingMessage(req, res, next))

  router.use(checkCompany)
  router.use((req, res, next) => companySettingsMiddleware(req, res, next, database))

  router.post('/', (req, res, next) => messageController.createOutgoingMessage(req, res, next))

  return router
}
