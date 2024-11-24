import mongoose from "mongoose";

import { logger } from "../utils/logger";

export class MongoDBConnector {
  private static host = process.env.MONGODB_HOST as string;
  private static username = process.env.MONGODB_USERNAME as string;
  private static password = process.env.MONGODB_PASSWORD as string;

  private static validate() {
    if (!this.host) {
      throw new Error("MongoDB host not provided");
    }

    if (!this.username || !this.password) {
      throw new Error("Username and password not provided");
    }
  }

  static getMongoUrl() {
    return `mongodb+srv://${this.username}:${this.password}@${this.host}`;
  }

  static async connect() {
    this.validate();

    const mongoUrl = this.getMongoUrl();

    logger.info(`Connecting to MongoDB: ${this.host}`);

    await mongoose.connect(mongoUrl, {
      readPreference: "primary",
      connectTimeoutMS: 30000,
      socketTimeoutMS: 20000,
    });

    logger.info(`Connected to MongoDB: ${this.host}`);
  }
}

export const coreDb = mongoose.connection.useDb("core");
