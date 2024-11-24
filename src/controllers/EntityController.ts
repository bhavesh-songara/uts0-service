import { Request, Response } from "express";
import Joi from "joi";

import { validateJoiSchema } from "../utils/validateJoiSchema";
import { EntityService } from "../services/EntityService";
// Add your controller methods here
export class EntityController {
  static async addEntity(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { projectId } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        projectId: Joi.string().hex().length(24).required(),
      }),
      data: { projectId },
    });

    await EntityService.addEntity({ projectId, userId });

    res.send({
      message: "Entity added successfully",
    });
  }

  static async deleteEntity(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { entityId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        entityId: Joi.string().hex().length(24).required(),
      }),
      data: { entityId },
    });

    await EntityService.deleteEntity({ entityId, userId });

    res.send({
      message: "Entity deleted successfully",
    });
  }

  static async getEntity(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { entityId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        entityId: Joi.string().hex().length(24).required(),
      }),
      data: { entityId },
    });

    const result = await EntityService.getEntity({ entityId, userId });

    res.send(result);
  }

  static async getEntities(req: Request, res: Response) {
    const userId = req.user?._id as string;
    const { projectId } = req.params;
    const { page = 0, size = 10 } = req.query;

    validateJoiSchema({
      schema: Joi.object({
        page: Joi.number().integer().min(0).optional(),
        size: Joi.number().integer().min(1).optional(),
      }),
      data: { page, size },
    });

    const result = await EntityService.getEntities({
      projectId,
      userId,
      page: Number(page),
      size: Number(size),
    });

    res.send(result);
  }
}
