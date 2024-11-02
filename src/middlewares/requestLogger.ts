import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const startedAt = Date.now();

  res.on("finish", () => {
    const endedAt = Date.now();
    const responseTime = endedAt - startedAt;

    if (!req.originalUrl.match("healthcheck")) {
      logger.http(`${req.method} ${req.originalUrl}`, {
        responseTime,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};
