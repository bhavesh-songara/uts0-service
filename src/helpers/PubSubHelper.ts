import { PubSub } from "@google-cloud/pubsub";

import { logger } from "../utils/logger";
import config from "../../config";
import { PubSubTopicsEnum } from "../constants/PubSub";

export class PubSubHelper {
  private static pubSubClient = new PubSub({
    projectId: config.googleCloud.projectId,
  });

  static async publishMessage(payload: { topic: PubSubTopicsEnum; data: any }) {
    const { topic, data } = payload;

    const dataBuffer = Buffer.from(JSON.stringify(data));

    try {
      const result = await this.pubSubClient.topic(topic).publishMessage({
        data: dataBuffer,
      });
      logger.info(`Message ${result} published.`);
    } catch (err) {
      logger.error("Error in publishing message", err);
    }
  }

  static async subscribeToTopic(payload: {
    topic: PubSubTopicsEnum;
    messageHandler: (message: any) => Promise<void> | void;
  }) {
    const { topic, messageHandler } = payload;

    const subscriptionName = `${topic}-sub`;

    const subscription = this.pubSubClient.subscription(subscriptionName);

    const messageHandlerWrapper = async (message: any) => {
      try {
        await messageHandler(message);
      } catch (err) {
        logger.error("Error in message handler", err);
      } finally {
        logger.info(`Acknowledging message ${message.id}`);
        message.ack();
      }
    };

    subscription.on("message", messageHandlerWrapper);

    logger.info(`Listening for messages on ${topic}...`);
  }

  static async listenForMessages() {}
}
