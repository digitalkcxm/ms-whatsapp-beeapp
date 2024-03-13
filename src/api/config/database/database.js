import knex from "knex";
import dotenv from "dotenv";

import knexfile from "../../../../knexfile.js";
import AppVariables from "../AppVariables.js";

dotenv.config();
AppVariables.loadConfig();
const environment = AppVariables.nodeEnv() || AppVariables.stateEnv();
const conf = knex(knexfile[environment]);

export default conf;
