import app from "./app";
import config from "../config";
import { logger } from "./utils/logger";
import { MongoDBConnector } from "./connectors/mongodb";
import { PubSubHelper } from "./helpers/PubSubHelper";

async function bootstrap() {
  try {
    await MongoDBConnector.connect();

    const { servicePort } = config;

    app.listen(servicePort, () => {
      logger.info(`Server started on port ${servicePort}`);
    });

    await PubSubHelper.listenForMessages();
  } catch (error) {
    logger.error("Error starting server", error);
    process.exit(1);
  }
}

process.on("uncaughtException", function (err: Error) {
  logger.error("uncaughtException", err);
});

process.on("unhandledRejection", function (err: Error) {
  logger.error("unhandledRejection", err);
});

bootstrap();
