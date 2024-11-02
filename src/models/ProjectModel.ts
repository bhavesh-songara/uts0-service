import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IProject {
  name: string;
  description?: string;
  userId: string;
  isDeleted?: boolean;
}

export interface IProjectDocument extends IProject {
  _id: mongoose.Types.ObjectId;
}

const projectSchema = new mongoose.Schema<IProject>(
  {
    name: { type: String, required: true },
    description: { type: String },
    userId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Projects",
  }
);

export const ProjectModel = coreDb.model("Project", projectSchema);
