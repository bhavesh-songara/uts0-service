import formidable from "formidable";
import fs from "fs";
import { Storage } from "@google-cloud/storage";
import config from "../../config";
import { logger } from "../utils/logger";
import createHttpError from "http-errors";
import { FileModel, IFile } from "../models";

export class FileHelper {
  static storage = new Storage();

  static async uploadFile(payload: { file: formidable.File; userId: string }) {
    const { file, userId } = payload;

    const fileStream = fs.createReadStream(file.filepath);
    const blob = this.storage
      .bucket(config.storageBucket)
      .file(file.newFilename);

    let fileDoc: IFile | undefined = undefined;

    await new Promise((resolve, reject) => {
      const blobStream = blob.createWriteStream();

      fileStream.on("error", (err) => {
        logger.error("Error reading file", err);
        reject(new createHttpError.InternalServerError("Error reading file"));
      });

      blobStream.on("error", (err) => {
        logger.error("Error uploading file", err);
        reject(new createHttpError.InternalServerError("Error uploading file"));
      });

      fileStream.on("end", () => {
        logger.info("File read successfully");

        fileDoc = {
          name: file.newFilename,
          size: file.size,
          contentType: file.mimetype as string,
          googleCloudStorageUri: `https://storage.googleapis.com/${config.storageBucket}/${file.newFilename}`,
          userId,
        };

        resolve("Done");
      });

      fileStream.pipe(blobStream);
    });

    if (fileDoc) {
      const result = await FileModel.create(fileDoc as IFile);

      return result;
    } else {
      throw new createHttpError.InternalServerError("Error uploading file");
    }
  }
}
