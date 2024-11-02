import { Request, Response } from "express";
import Joi from "joi";

import { validateJoiSchema } from "../utils/validateJoiSchema";
import { ProjectService } from "../services/ProjectService";

// Add your controller methods here
export class ProjectController {
  static async addProject(req: Request, res: Response) {
    const userId = req.oidc.user?.sub;

    const { name, description } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        name: Joi.string().trim().required(),
        description: Joi.string().allow(""),
      }),
      data: { name, description },
    });

    await ProjectService.addProject({ name, description, userId });

    res.send({
      message: "Project added successfully",
    });
  }

  static async updateProject(req: Request, res: Response) {
    const userId = req.oidc.user?.sub;
    const { projectId } = req.params;
    const { name, description } = req.body;

    validateJoiSchema({
      schema: Joi.object({
        projectId: Joi.string().hex().length(24).required(),
        name: Joi.string().trim().optional(),
        description: Joi.string().allow("").optional(),
      }),
      data: { projectId, name, description },
    });

    await ProjectService.updateProject({
      projectId,
      name,
      description,
      userId,
    });

    res.send({
      message: "Project updated successfully",
    });
  }

  static async deleteProject(req: Request, res: Response) {
    const userId = req.oidc.user?.sub;
    const { projectId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        projectId: Joi.string().hex().length(24).required(),
      }),
      data: { projectId },
    });

    await ProjectService.deleteProject({ projectId, userId });

    res.send({
      message: "Project deleted successfully",
    });
  }

  static async getProject(req: Request, res: Response) {
    const userId = req.oidc.user?.sub;
    const { projectId } = req.params;

    validateJoiSchema({
      schema: Joi.object({
        projectId: Joi.string().hex().length(24).required(),
      }),
      data: { projectId },
    });

    const result = await ProjectService.getProject({ projectId, userId });

    res.send(result);
  }

  static async getAllProjects(req: Request, res: Response) {
    const userId = req.oidc.user?.sub;

    const result = await ProjectService.getAllProjects({ userId });

    res.send(result);
  }
}
