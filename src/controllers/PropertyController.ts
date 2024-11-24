import { Request, Response } from "express";
import Joi from "joi";

import { validateJoiSchema } from "../utils/validateJoiSchema";
import { PropertyService } from "../services/PropertyService";
import { PropertyToolEnum, PropertyTypeEnum } from "../models";

// Add your controller methods here
export class PropertyController {
  static async addProperty(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { projectId, type } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        projectId: Joi.string().hex().length(24).required(),
        type: Joi.string()
          .valid(...Object.values(PropertyTypeEnum))
          .required(),
      }),
      data: { projectId, type },
    });

    await PropertyService.addProperty({
      projectId,
      userId,
      type,
    });

    res.send({
      message: "Property added successfully",
    });
  }

  static async updateProperty(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { propertyId } = req.params;
    const { name, description, prompt, tool, options } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        propertyId: Joi.string().hex().length(24).required(),
        name: Joi.string().trim().optional(),
        description: Joi.string().allow("").optional(),
        prompt: Joi.string().allow("").optional(),
        tool: Joi.string()
          .valid(...Object.values(PropertyToolEnum))
          .required(),
        options: Joi.array().items(Joi.string()).optional(),
      }),
      data: { propertyId, name, description, prompt, tool, options },
    });

    await PropertyService.updateProperty({
      propertyId,
      userId,
      name,
      description,
      prompt,
      tool,
      options,
    });

    res.send({
      message: "Property updated successfully",
    });
  }

  static async deleteProperty(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { propertyId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        propertyId: Joi.string().hex().length(24).required(),
      }),
      data: { propertyId },
    });

    await PropertyService.deleteProperty({ propertyId, userId });

    res.send({
      message: "Property deleted successfully",
    });
  }

  static async getProperty(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { propertyId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        propertyId: Joi.string().hex().length(24).required(),
      }),
      data: { propertyId },
    });

    const result = await PropertyService.getProperty({ propertyId, userId });

    res.send(result);
  }

  static async getAllProperties(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { projectId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        projectId: Joi.string().hex().length(24).required(),
      }),
      data: { projectId },
    });

    const result = await PropertyService.getAllProperties({
      projectId,
      userId,
    });

    res.send(result);
  }
}
