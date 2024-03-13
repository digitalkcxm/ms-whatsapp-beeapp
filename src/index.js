import 'dotenv/config'

import { startServer } from './api/config/server.js'
import { startConsumersQueues } from './api/config/consumersqueues.js'
import AppVariables from './api/config/AppVariables.js'

AppVariables.loadConfig()

startConsumersQueues()

startServer()
