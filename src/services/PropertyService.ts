import createHttpError from "http-errors";

import {
  FieldModel,
  ProjectModel,
  PropertyModel,
  PropertyToolEnum,
  PropertyTypeEnum,
} from "../models";
import { PropertyHelper } from "../helpers/PropertyHelper";

/**
 * TODO:
 * - When adding new property add jobs to calculate the properties for the existing entities
 */

// Add your service methods here
export class PropertyService {
  static async addProperty(payload: {
    projectId: string;
    userId: string;
    name: string;
    description?: string;
    type: PropertyTypeEnum;
    prompt?: string;
    tool: PropertyToolEnum;
    options?: Array<string>;
  }) {
    const {
      projectId,
      userId,
      name,
      description,
      type,
      prompt,
      tool,
      options,
    } = payload;

    const project = await ProjectModel.findOne({
      _id: projectId,
      userId,
      isDeleted: false,
    });

    if (!project) {
      throw new createHttpError.NotFound("Project not found");
    }

    const { inputPropertyIds } = await PropertyHelper.validatePrompt({
      prompt,
      projectId,
      userId,
    });

    if (type === PropertyTypeEnum.File && tool == PropertyToolEnum.User) {
      throw new createHttpError.BadRequest(
        "Invalid property type and tool combination"
      );
    }

    await PropertyModel.create({
      projectId,
      userId,
      name,
      description,
      type,
      prompt,
      inputPropertyIds,
      tool,
      options,
    });
  }

  static async updateProperty(payload: {
    propertyId: string;
    userId: string;
    name?: string;
    description?: string;
    prompt?: string;
    tool: PropertyToolEnum;
    options?: Array<string>;
  }) {
    const { propertyId, userId, name, description, prompt, tool, options } =
      payload;

    const property = await PropertyModel.findOne({
      _id: propertyId,
      userId,
      isDeleted: false,
    });

    if (!property) {
      throw new createHttpError.NotFound("Property not found");
    }

    const { inputPropertyIds } = await PropertyHelper.validatePrompt({
      prompt,
      projectId: property.projectId?.toString(),
      userId,
    });

    await property.updateOne({
      name,
      description,
      prompt,
      inputPropertyIds,
      tool,
      options,
    });
  }

  static async deleteProperty(payload: { propertyId: string; userId: string }) {
    const { propertyId, userId } = payload;

    const property = await PropertyModel.findOneAndDelete({
      _id: propertyId,
      userId,
      isDeleted: false,
    });

    if (!property) {
      throw new createHttpError.NotFound("Property not found");
    }

    await FieldModel.updateMany(
      { propertyId, userId },
      { $set: { isDeleted: true } }
    );
  }

  static async getProperty(payload: { propertyId: string; userId: string }) {
    const { propertyId, userId } = payload;

    const property = await PropertyModel.findOne({
      _id: propertyId,
      userId,
      isDeleted: false,
    });

    if (!property) {
      throw new createHttpError.NotFound("Property not found");
    }

    return { property };
  }

  static async getAllProperties(payload: {
    projectId: string;
    userId: string;
  }) {
    const { projectId, userId } = payload;

    const properties = await PropertyModel.find({
      projectId,
      userId,
      isDeleted: false,
    });

    return { properties };
  }
}
