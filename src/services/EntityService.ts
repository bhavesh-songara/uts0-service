import createHttpError from "http-errors";
import { EntityModel, ProjectModel } from "../models";

// Add your service methods here
export class EntityService {
  static async addEntity(payload: { projectId: string; userId: string }) {
    const { projectId, userId } = payload;

    const projectExists = await ProjectModel.exists({
      _id: projectId,
      userId,
    });

    if (!projectExists) {
      throw new createHttpError.NotFound("Project not found");
    }

    await EntityModel.create({
      projectId,
      userId,
    });
  }

  static async deleteEntity(payload: { entityId: string; userId: string }) {
    const { entityId, userId } = payload;

    const result = await EntityModel.findOneAndUpdate(
      { _id: entityId, userId, isDeleted: false },
      {
        isDeleted: true,
      }
    );

    if (!result) {
      throw new createHttpError.NotFound("Entity not found");
    }
  }

  static async getEntity(payload: { entityId: string; userId: string }) {
    const { entityId, userId } = payload;

    const entity = await EntityModel.findOne({
      _id: entityId,
      userId,
      isDeleted: false,
    });

    if (!entity) {
      throw new createHttpError.NotFound("Entity not found");
    }

    return { entity };
  }

  static async getEntities(payload: {
    projectId: string;
    userId: string;
    page: number;
    size: number;
  }) {
    const { projectId, userId, page, size } = payload;

    const dbQuery = {
      projectId,
      userId,
      isDeleted: false,
    };

    const [data, totalCount] = await Promise.all([
      EntityModel.find(dbQuery)
        .skip(page * size)
        .limit(size),
      EntityModel.countDocuments(dbQuery),
    ]);

    return { data, totalCount };
  }
}
