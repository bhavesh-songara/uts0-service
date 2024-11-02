import createHttpError from "http-errors";
import { PropertyHelper } from "../helpers/PropertyHelper";
import {
  EntityModel,
  FieldModel,
  FieldStatusEnum,
  PropertyModel,
  PropertyTypeEnum,
} from "../models";
import { FileHelper } from "../helpers/FileHelper";
import formidable from "formidable";

// Add your service methods here
export class FieldService {
  static async updateField(payload: {
    entityId: string;
    propertyId: string;
    userId: string;
    value?: any;
    file?: formidable.File;
  }) {
    const { entityId, propertyId, userId, value, file } = payload;

    const [entity, property, field] = await Promise.all([
      EntityModel.findOne({
        _id: entityId,
        userId,
        isDeleted: false,
      }),
      PropertyModel.findOne({
        _id: propertyId,
        userId,
        isDeleted: false,
      }),
      FieldModel.findOne({
        entityId,
        propertyId,
        userId,
        isDeleted: false,
      }),
    ]);

    if (!entity) {
      throw new createHttpError.NotFound("Entity not found");
    }

    if (!property) {
      throw new createHttpError.NotFound("Property not found");
    }

    let manualValue: any = null;

    if (property.type === PropertyTypeEnum.File) {
      if (!file) {
        throw new createHttpError.BadRequest("File is required");
      }

      PropertyHelper.validateFile({
        file,
      });

      const fileDoc = await FileHelper.uploadFile({
        file: value,
        userId,
      });

      manualValue = fileDoc._id?.toString();
    } else {
      PropertyHelper.validatePropertyValue({
        type: property.type,
        value,
      });

      manualValue = value;
    }

    if (field) {
      await FieldModel.updateOne(
        { entityId, propertyId, userId, isDeleted: false },
        {
          manualValue,
        }
      );
    } else {
      await FieldModel.create({
        entityId,
        propertyId,
        userId,
        manualValue,
        status: FieldStatusEnum.Completed,
      });
    }
  }
}
