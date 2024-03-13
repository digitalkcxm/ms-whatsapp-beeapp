import dotenv from "dotenv";
import AppVariables from "./src/api/config/AppVariables.js";

dotenv.config();
AppVariables.loadConfig();

export default {
  development: {
    client: "postgresql",
    connection: {
      host: AppVariables.dbHost(),
      database: AppVariables.dbDatabase(),
      user: AppVariables.dbUsername(),
      password: AppVariables.dbPassword(),
    },
    migrations: {
      directory: "./src/api/config/database/migrations",
    },
    seeds: {
      directory: "./src/api/config/database/seeds",
    },
  },

  staging: {
    client: "postgresql",
    connection: {
      host: AppVariables.dbHost(),
      database: AppVariables.dbDatabase(),
      user: AppVariables.dbUsername(),
      password: AppVariables.dbPassword(),
    },
    migrations: {
      directory: "./src/api/config/database/migrations",
    },
    seeds: {
      directory: "./src/api/config/database/seeds",
    },
    pool: { min: 0, max: 3 }, // Esta configuração define a quantidade minima e máxima de conexões
  },

  production: {
    client: "postgresql",
    connection: {
      host: AppVariables.dbHost(),
      database: AppVariables.dbDatabase(),
      user: AppVariables.dbUsername(),
      password: AppVariables.dbPassword(),
    },
    migrations: {
      directory: "./src/api/config/database/migrations",
    },
    seeds: {
      directory: "./src/api/config/database/seeds",
    },
    pool: { min: 0, max: 7 }, // Esta configuração define a quantidade minima e máxima de conexões
    propagateCreateError: false,
  },

  testing: {
    client: "postgresql",
    connection: {
      host: AppVariables.dbHostTest(),
      database: AppVariables.dbDatabaseTest(),
      user: AppVariables.dbUsernameTest(),
      password: AppVariables.dbPasswordTest(),
      charset: "utf8",
    },
    migrations: {
      directory: "./src/api/config/database/migrations",
    },
    seeds: {
      directory: "./src/api/config/database/seeds",
    },
  },
};
