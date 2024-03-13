import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

import routes from "../routes/index.js";
import AppVariables from "./AppVariables.js";
import database from "./database/database.js";

const app = express();

AppVariables.loadConfig();

app.use(bodyParser.json());

routes(app, axios, database, console);

const port = process.env.PORT || 4000;

function startServer() {
  app.listen(port, () => {
    console.log(`API live on port ${port}`);
  });
}

export { startServer, app, database };
