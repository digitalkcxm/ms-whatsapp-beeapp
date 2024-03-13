import HealthCheck from '@digitalk-npm/healthcheck-dg/src/lib/HealthCheck.js'
import AppVariables from '../config/AppVariables.js'

export default class HealthController {
  async checkHealth(req, res, next) {
    const healthMscompanyUrl = `${AppVariables.msCompany()}/health`
    const checker = HealthCheck.newInstance()
    checker.addDatabaseDependency(AppVariables.dbHost(), '5432', AppVariables.dbUsername(), AppVariables.dbPassword(), AppVariables.dbDatabase(), 'postgres', 'postgres').addHttpServiceDependency(healthMscompanyUrl, 'get', 200, { status: 'ok' }, {}, 'mscompany').addMessageQueueDependency(AppVariables.rabbitMQHost(), AppVariables.rabbitMQPort(), AppVariables.rabbitMQUser(), AppVariables.rabbitMQPassword(), 'rabbitmq', 'rabbitmq', 'critical')
    try {
      const result = await checker.executeCheck()
      return res.status(200).send(result)
    } catch (err) {
      return next(err)
    }
  }
}
