import createHttpError from "http-errors";
import { ProjectModel } from "../models";

// Add your service methods here
export class ProjectService {
  static async addProject(payload: {
    name: string;
    description?: string;
    userId: string;
  }) {
    const { name, description, userId } = payload;

    await ProjectModel.create({
      name,
      description,
      userId,
    });
  }

  static async updateProject(payload: {
    projectId: string;
    name?: string;
    description?: string;
    userId: string;
  }) {
    const { projectId, name, description, userId } = payload;

    const result = await ProjectModel.findOneAndUpdate(
      { _id: projectId, userId, isDeleted: false },
      {
        name,
        description,
      }
    );

    if (!result) {
      throw new createHttpError.NotFound("Project not found");
    }
  }

  static async deleteProject(payload: { projectId: string; userId: string }) {
    const { projectId, userId } = payload;

    const result = await ProjectModel.findOneAndUpdate(
      { _id: projectId, userId, isDeleted: false },
      {
        isDeleted: true,
      }
    );

    if (!result) {
      throw new createHttpError.NotFound("Project not found");
    }
  }

  static async getProject(payload: { projectId: string; userId: string }) {
    const { projectId, userId } = payload;

    const project = await ProjectModel.findOne({
      _id: projectId,
      userId,
      isDeleted: false,
    });

    if (!project) {
      throw new createHttpError.NotFound("Project not found");
    }

    return { project };
  }

  static async getAllProjects(payload: { userId: string }) {
    const { userId } = payload;

    const projects = await ProjectModel.find({ userId, isDeleted: false });

    return { projects };
  }
}
