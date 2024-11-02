import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IFile {
  name: string;
  size: number;
  contentType: string;
  googleCloudStorageUri: string;
  uploadedBy: string;
}

export interface IFileDocument extends IFile {
  _id: mongoose.Types.ObjectId;
}

const fileSchema = new mongoose.Schema<IFile>(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    contentType: { type: String, required: true },
    googleCloudStorageUri: { type: String, required: true },
    uploadedBy: { type: String },
  },
  {
    timestamps: true,
    collection: "Files",
  }
);

export const FileModel = coreDb.model("File", fileSchema);
