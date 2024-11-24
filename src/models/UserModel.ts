import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export interface IUser {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
}

export interface IUserDocument extends IUser {
  _id: mongoose.Types.ObjectId;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  {
    timestamps: true,
    collection: "Users",
  }
);

export const UserModel = coreDb.model("User", userSchema);
