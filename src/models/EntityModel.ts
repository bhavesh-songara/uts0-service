import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IEntity {
  workspaceId: mongoose.Types.ObjectId | string;
  projectId: mongoose.Types.ObjectId | string;
  createdBy?: mongoose.Types.ObjectId | string;
  updatedBy?: mongoose.Types.ObjectId | string;
  isDeleted?: boolean;
}

export interface IEntityDocument extends IEntity {
  _id: mongoose.Types.ObjectId;
}

const entitySchema = new mongoose.Schema<IEntity>(
  {
    workspaceId: { type: mongoose.Schema.ObjectId, required: true },
    projectId: { type: mongoose.Schema.ObjectId, required: true },
    createdBy: { type: mongoose.Schema.ObjectId },
    updatedBy: { type: mongoose.Schema.ObjectId },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Entities",
  }
);

export const EntityModel = coreDb.model("Entity", entitySchema);
