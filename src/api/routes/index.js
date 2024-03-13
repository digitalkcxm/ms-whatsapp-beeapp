import axios from 'axios'
import errorHandler from '../middlewares/ErrorHandlerMiddleware.js'
import companySettingsRoutes from './companySettings.js'
import healthRoutes from './health.js'
import messageRoutes from './messages.js'
import protocolRoutes from './protocols.js'
import whatsappInstanceRoutes from './whatsappInstances.js'

export default function routes(app, httpClient, database, logger = console) {
  app.use('/api/v1/health', healthRoutes(axios), errorHandler)
  app.use('/api/v1/company-settings', companySettingsRoutes(database), errorHandler)
  app.use('/api/v1/whatsapp-instances', whatsappInstanceRoutes(database, logger), errorHandler)
  app.use('/api/v1/protocols', protocolRoutes(database, logger), errorHandler)
  app.use('/api/v1/messages', messageRoutes(database, logger), errorHandler)
}
