import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export type ValueType =
  | mongoose.Types.ObjectId
  | string
  | number
  | boolean
  | Date
  | Array<string>
  | Array<number>
  | Array<boolean>
  | Array<Date>
  | null;

export enum FieldStatusEnum {
  Pending = "pending",
  Processing = "processing",
  Completed = "completed",
}

export interface IField {
  entityId: mongoose.Types.ObjectId | string;
  propertyId: mongoose.Types.ObjectId | string;
  manualValue?: ValueType;
  toolValue?: ValueType;
  status: FieldStatusEnum;
  isDeleted?: boolean;
  createdBy?: string;
  updatedBy?: string;
}

export interface IFieldDocument extends IField {
  _id: mongoose.Types.ObjectId;
}

export const fieldSchema = new mongoose.Schema<IField>(
  {
    entityId: { type: mongoose.Schema.ObjectId, required: true },
    propertyId: { type: mongoose.Schema.ObjectId, required: true },
    manualValue: { type: mongoose.Schema.Types.Mixed },
    toolValue: { type: mongoose.Schema.Types.Mixed },
    status: {
      type: String,
      enum: Object.values(FieldStatusEnum),
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    createdBy: { type: String },
    updatedBy: { type: String },
  },
  {
    timestamps: true,
    collection: "Fields",
  }
);

export const FieldModel = coreDb.model("Field", fieldSchema);
