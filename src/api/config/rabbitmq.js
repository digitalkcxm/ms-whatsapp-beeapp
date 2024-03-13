import amqp from "amqplib/callback_api.js";
import AppVariables from "./appVariables.js";

const logger = console;

global._consumers = [];
global._connRabbitGlobal = false;
global._channelGlobal = false;

export default class RabbitMQ {
  static async newConnection(io) {
    if (global._connRabbitGlobal) {
      return global._connRabbitGlobal;
    }

    const rabbitmqUser = AppVariables.rabbitMQUser();
    const rabbitmqPass = AppVariables.rabbitMQPassword();
    const rabbitmqHost = AppVariables.rabbitMQHost();
    const rabbitmqPort = AppVariables.rabbitMQPort();

    const connStr = `amqp://${rabbitmqUser}:${rabbitmqPass}@${rabbitmqHost}:${rabbitmqPort}`;

    const connRabbit = await new Promise((resolve, reject) => {
      amqp.connect(connStr + "?heartbeat=20", function (err, conn) {
        if (err) {
          logger.error(`Global connection with rabbitmq failed with error: ${err.message}`);
          return setTimeout(function () {
            RabbitMQ.newConnection(io);
          }, 1000);
        }
        conn.on("error", function (err) {
          if (err.message !== "Connection closing") {
            logger.error(`Global connection with rabbitmq failed with error: ${err.message}`);
            reject(err);
          }
        });
        conn.on("close", function () {
          logger.error(`Global Connection with rabbitmq was close, restart api to try reconnect`);
          return setTimeout(function () {
            global._connRabbitGlobal = false;
            global._channelGlobal = false;
            RabbitMQ.newConnection(io);
          }, 1000);
        });

        resolve(conn);
      });
    });

    global._connRabbitGlobal = connRabbit;

    await RabbitMQ.newChannel();
    RabbitMQ.startConsumers(connRabbit);

    return global._connRabbitGlobal;
  }

  static async newChannel() {
    const conn = await RabbitMQ.newConnection();
    if (global._channelGlobal) {
      return global._channelGlobal;
    }

    const channel = await new Promise((resolve, reject) => {
      conn.createChannel((err, ch) => {
        if (err) reject(err);

        resolve(ch);
      });
    });

    channel.on("close", () => {
      global._channelGlobal = false;
      console.log("CHANNEL CLOSED");
    });
    channel.on("error", (err) => {
      global._channelGlobal = false;
      console.log({ err }, "CHANNEL ERROR");
    });

    global._channelGlobal = channel;

    return channel;
  }

  static addConsumer(consumer = {}) {
    global._consumers.push(consumer);
  }

  static startConsumers(connRabbit = {}) {
    const consumers = global._consumers;
    for (const consumer of consumers) {
      consumer();
    }
  }
}
