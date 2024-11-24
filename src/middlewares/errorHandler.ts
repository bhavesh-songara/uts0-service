import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";

import { logger } from "../utils/logger";

// export const notFoundHandler = (req: Request, res: Response) => {
//   return res.status(404).json({
//     message: "Resource not found",
//   });
// };

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(404).json({
    message: "Resource not found",
    statusCode: 404,
  });
};

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error("errorHandler", err);

  if (err instanceof HttpError) {
    res.status(err.statusCode).json({
      message: err.message,
      statusCode: err.statusCode,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
      statusCode: 500,
    });
  }
};
