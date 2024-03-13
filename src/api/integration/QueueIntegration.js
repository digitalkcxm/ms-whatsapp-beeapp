import AppVariables from "../config/appVariables.js";
import RabbitMQ from "../config/rabbitmq.js";

export default class QueueIntegration {
  constructor(logger = console) {
    this.logger = logger;
  }

  async sendToQueue(data, queue) {
    if (AppVariables.stateEnv() === "testing") return true;

    try {
      const channel = await RabbitMQ.newChannel();
      channel.assertQueue(queue, { durable: true });
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(data)), { persistent: true });

      return true;
    } catch (error) {
      console.error("ERRO AO PUBLICAR MENSAGEM NA FILA  ==>>", error);
      return false;
    }
  }
}
