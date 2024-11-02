import { Request } from "express";
import formidable from "formidable";
import { logger } from "./logger";

export class FileUtils {
  static async parseFiles(
    req: Request
  ): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
    // Check if the request contains any files
    if (
      !req.headers ||
      !req.headers["content-type"] ||
      !req.headers["content-type"].includes("multipart/form-data")
    ) {
      return Promise.resolve({ fields: req.body, files: {} });
    }

    const form = formidable({ multiples: true, keepExtensions: true });

    return new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) {
          return reject(new Error("Internal Server Error"));
        }

        return resolve({ fields, files });
      });
    });
  }
}
