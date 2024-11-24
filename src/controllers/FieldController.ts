import { Request, Response } from "express";
import Joi from "joi";
import formidable from "formidable";

import { validateJoiSchema } from "../utils/validateJoiSchema";
import { FieldService } from "../services/FieldService";
import { FileUtils } from "../utils/file";

// Add your controller methods here
export class FieldController {
  static async updateField(req: Request, res: Response) {
    const userId = req.user?._id as string;

    const { fields, files } = await FileUtils.parseFiles(req);

    const { entityId, propertyId, value } = fields as any;

    const file = files.file as any;

    validateJoiSchema({
      schema: Joi.object({
        entityId: Joi.string().required(),
        propertyId: Joi.string().required(),
      }),
      data: { entityId, propertyId },
    });

    await FieldService.updateField({
      entityId,
      propertyId,
      userId,
      value,
      file,
    });

    res.send({ message: "Field updated successfully" });
  }
}
