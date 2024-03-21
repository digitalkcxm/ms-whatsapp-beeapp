import axios from 'axios'
import MessageController from '../controllers/MessageController.js'
import BeeAppIntegration from '../integration/BeepAppIntegration.js'
import CompanySettingsRepository from '../repositories/CompanySettingsRepository.js'
import MessageRepository from '../repositories/MessageRepository.js'
import ProtocolRepository from '../repositories/ProtocolRepository.js'
import WhatsappInstanceRepository from '../repositories/WhatsappInstancesRepository.js'

import RabbitMQ from './rabbitmq.js'

import { database } from './server.js'
import CoreIntegration from '../integration/CoreIntegration.js'
import CompanyIntegration from '../integration/company/CompanyIntegration.js'
import QueueIntegration from '../integration/QueueIntegration.js'

export async function startConsumersQueues() {
  const messageRepo = new MessageRepository(database)
  const protocolRepo = new ProtocolRepository(database)
  const whatsappInstanceRepo = new WhatsappInstanceRepository(database)
  const companySettingsRepo = new CompanySettingsRepository(database)
  const beeAppIntegration = new BeeAppIntegration(axios)
  const coreIntegration = new CoreIntegration(axios)
  const companyIntegration = new CompanyIntegration(axios)
  const queueIntegration = new QueueIntegration(console)

  const messageController = new MessageController(console, messageRepo, protocolRepo, whatsappInstanceRepo, companySettingsRepo, beeAppIntegration, coreIntegration, companyIntegration, queueIntegration)

  RabbitMQ.addConsumer(() => {
    messageController.queue()
  })

  const conn = await RabbitMQ.newConnection()
  await RabbitMQ.newChannel()

  RabbitMQ.startConsumers(conn)
}
