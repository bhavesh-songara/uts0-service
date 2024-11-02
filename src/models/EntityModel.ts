import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IEntity {
  projectId: mongoose.Types.ObjectId | string;
  isDeleted?: boolean;
  userId: string;
}

export interface IEntityDocument extends IEntity {
  _id: mongoose.Types.ObjectId;
}

const entitySchema = new mongoose.Schema<IEntity>(
  {
    projectId: { type: mongoose.Schema.ObjectId, required: true },
    userId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Entities",
  }
);

export const EntityModel = coreDb.model("Entity", entitySchema);
