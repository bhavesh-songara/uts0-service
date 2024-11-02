import _ from "lodash";
import { PropertyModel, PropertyToolEnum, PropertyTypeEnum } from "../models";
import createHttpError from "http-errors";

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
}
