global._variables = {}

export default class AppVariables {
  static loadConfig() {
    global._variables = process.env
  }

  static nodeEnv() {
    return global._variables['NODE_ENV']
  }

  static stateEnv() {
    return global._variables['STATE_ENV']
  }

  static port() {
    return global._variables['PORT']
  }

  static msCompany() {
    return global._variables['MSCOMPANY_URL']
  }

  static dbHostTest() {
    return global._variables['DB_HOST_TEST']
  }

  static dbUsernameTest() {
    return global._variables['DB_USERNAME_TEST']
  }

  static dbPasswordTest() {
    return global._variables['DB_PASSWORD_TEST']
  }

  static dbDatabaseTest() {
    return global._variables['DB_DATABASE_TEST']
  }

  static dbHost() {
    return global._variables['DB_HOST']
  }

  static dbUsername() {
    return global._variables['DB_USERNAME']
  }

  static dbPassword() {
    return global._variables['DB_PASSWORD']
  }

  static dbDatabase() {
    return global._variables['DB_DATABASE']
  }

  static beeAppUrl() {
    return global._variables['BEEAPP_URL']
  }

  static beeAppGlobalKey() {
    return global._variables['BEEAPP_GLOBAL_KEY']
  }

  static rabbitMQHost() {
    return global._variables['RABBITMQ_HOST']
  }

  static rabbitMQPort() {
    return global._variables['RABBITMQ_PORT']
  }

  static rabbitMQUser() {
    return global._variables['RABBITMQ_USER']
  }

  static rabbitMQPassword() {
    return global._variables['RABBITMQ_PASSWORD']
  }
}
