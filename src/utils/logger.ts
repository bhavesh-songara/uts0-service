import {
  createLogger,
  format,
  Logger as WinstonLogger,
  transports,
} from "winston";
import "winston-daily-rotate-file";
import { v4 as uuid } from "uuid";
import * as cls from "cls-hooked";
import { Request, Response, NextFunction } from "express";

const clsNamespace = cls.createNamespace("logger");

class Logger {
  private serviceName: string = "uts0-service";
  private logLevel: string = "debug";
  private logger: WinstonLogger;

  constructor() {
    this.logger = createLogger({
      level: this.logLevel,
      format: format.combine(
        this.logFormat(),
        format.timestamp(),
        format.errors({ stack: true }),
        format.splat(),
        format.json()
      ),
    });

    this.logger.add(
      new transports.Console({
        format: format.combine(this.consoleFormat()),
      })
    );
  }

  private logFormat() {
    const formatWithRequestData = format((info) => {
      const requestContext = clsNamespace.get("requestContext") || {};

      return {
        ...info,
        serviceName: this.serviceName,
        ...requestContext,
      };
    });

    return formatWithRequestData();
  }

  private consoleFormat() {
    return format.printf(
      ({
        level,
        message,
        timestamp,
        stack,
        responseTime,
        statusCode,
        contextId,
      }) => {
        let contextTxt = "";

        if (contextId) {
          contextTxt = `[${contextId}]`;
        }

        switch (level) {
          case "error": {
            return `${timestamp} [${level.toUpperCase()}]${contextTxt} ${message}: ${stack}`;
          }

          case "http": {
            return `${timestamp} [${level.toUpperCase()}]${contextTxt} "${message}" ${statusCode} ${responseTime}ms`;
          }

          default: {
            return `${timestamp} [${level.toUpperCase()}]${contextTxt} ${message}`;
          }
        }
      }
    );
  }

  log(level: string, ...args: any[]) {
    this.logger.log(level, args);
  }

  debug(message: string, ...args: any[]) {
    this.logger.debug(message, ...args);
  }

  info(message: string, ...args: any[]) {
    this.logger.info(message, ...args);
  }

  warn(message: string, ...args: any[]) {
    this.logger.warn(message, ...args);
  }

  error(message: string, ...args: any[]) {
    this.logger.error(message, ...args);
  }

  http(message: string, ...args: any[]) {
    this.logger.http(message, ...args);
  }
}

export const logger = new Logger();

export const contextMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  clsNamespace.run(() => {
    try {
      const requestContext: any = {};

      const contextId = uuid();

      requestContext.contextId = contextId;

      clsNamespace.set("requestContext", requestContext);
    } catch (err) {
      logger.error(`Error in contextMiddleware: ${err}`);
    } finally {
      next();
    }
  });
};
