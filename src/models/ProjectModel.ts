import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IProject {
  name: string;
  description?: string;
  createdBy?: string;
  updatedBy?: string;
  isDeleted?: boolean;
}

export interface IProjectDocument extends IProject {
  _id: mongoose.Types.ObjectId;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: String },
    updatedBy: { type: String },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Projects",
  }
);

export const ProjectModel = coreDb.model("Project", projectSchema);
