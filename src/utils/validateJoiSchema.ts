import { ObjectSchema, ValidationOptions } from "joi";
import createHttpError from "http-errors";

interface SchemaValidator {
  schema: ObjectSchema;
  data: { [key: string]: any };
  options?: ValidationOptions;
}

export const validateJoiSchema = ({
  schema,
  data,
  options,
}: SchemaValidator) => {
  const { error } = schema.validate(data, options);

  if (error) {
    throw new createHttpError.BadRequest(error.message);
  }
};
