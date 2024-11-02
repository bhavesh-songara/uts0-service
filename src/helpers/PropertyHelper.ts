import _ from "lodash";
import createHttpError from "http-errors";
import moment from "moment";
import formidable from "formidable";

import { PropertyModel, PropertyToolEnum, PropertyTypeEnum } from "../models";
import config from "../../config";

export class PropertyHelper {
  static getInputPropertyIds(payload: { prompt?: string }) {
    const { prompt } = payload;
    const inputPropertyIds = new Set<string>();

    if (prompt) {
      const words = prompt.split(" ");
      words.forEach((word) => {
        if (word.startsWith("@")) {
          inputPropertyIds.add(word?.slice(1));
        }
      });
    }
    return Array.from(inputPropertyIds);
  }

  static async validatePrompt(payload: {
    prompt?: string;
    projectId: string;
    userId: string;
  }) {
    const { prompt, projectId, userId } = payload;

    const inputPropertyIds = this.getInputPropertyIds({ prompt });

    if (inputPropertyIds.length > 0) {
      const properties = await PropertyModel.find({
        _id: { $in: inputPropertyIds },
        projectId,
        userId,
        isDeleted: false,
      });

      const propertiesMap = _.keyBy(properties, "_id");

      const missingPropertyIds = inputPropertyIds.filter(
        (id) => !propertiesMap[id]
      );

      if (missingPropertyIds.length) {
        throw new createHttpError.BadRequest(
          `Invalid prompt. The following properties are not found: ${missingPropertyIds.join(
            ", "
          )}`
        );
      }
    }

    return { inputPropertyIds };
  }

  static async validateFile(payload: { file: formidable.File }) {
    const { file } = payload;

    if (file.size > config.maxFileSizeInMb * 1024 * 1024) {
      throw new createHttpError.BadRequest(
        `File size exceeds ${config.maxFileSizeInMb} MB`
      );
    }

    const validMimeType = ["image/jpeg", "image/png", "application/pdf"];

    if (file.mimetype && !validMimeType.includes(file.mimetype)) {
      throw new createHttpError.BadRequest(
        `Invalid file type. Supported types are: ${validMimeType.join(", ")}`
      );
    }
  }

  static validatePropertyValue(payload: {
    type: PropertyTypeEnum;
    value: any;
  }) {
    const { type, value } = payload;

    if (value == null || value == undefined) {
      return;
    }

    if (typeof value === "string" && value.trim() === "") {
      return;
    }

    switch (type) {
      case PropertyTypeEnum.Text:
      case PropertyTypeEnum.SingleSelect:
        {
          const isValid =
            typeof value === "string" || typeof value === "number";

          if (!isValid) {
            throw new createHttpError.BadRequest(
              "Invalid value. Expected a text value"
            );
          }
        }
        break;
      case PropertyTypeEnum.Number:
        {
          const isNotValid = isNaN(parseFloat(value));

          if (isNotValid) {
            throw new createHttpError.BadRequest(
              "Invalid value. Expected a number"
            );
          }
        }
        break;
      case PropertyTypeEnum.Date:
        {
          const isValid = moment(value).isValid();

          if (!isValid) {
            throw new createHttpError.BadRequest(
              "Invalid value. Expected a date"
            );
          }
        }
        break;
      case PropertyTypeEnum.Boolean:
        {
          const isValid = typeof value === "boolean";

          if (!isValid) {
            throw new createHttpError.BadRequest(
              "Invalid value. Expected a boolean"
            );
          }
        }
        break;
      case PropertyTypeEnum.MultiSelect:
        {
          const isValid = Array.isArray(value);

          if (!isValid) {
            throw new createHttpError.BadRequest(
              "Invalid value. Expected an array"
            );
          }
        }
        break;
    }
  }
}
