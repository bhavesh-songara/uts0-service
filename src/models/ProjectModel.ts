import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IProject {
  workspaceId: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  createdBy?: mongoose.Types.ObjectId | string;
  updatedBy?: mongoose.Types.ObjectId;
  isDeleted?: boolean;
}

export interface IProjectDocument extends IProject {
  _id: mongoose.Types.ObjectId;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    workspaceId: { type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.ObjectId },
    updatedBy: { type: mongoose.Schema.ObjectId },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Projects",
  }
);

export const ProjectModel = coreDb.model("Project", projectSchema);
