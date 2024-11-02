import mongoose from "mongoose";
import { coreDb } from "../connectors/mongodb";

export enum PropertyTypeEnum {
  Text = "text",
  Number = "number",
  Date = "date",
  Boolean = "boolean",
  SingleSelect = "single_select",
  MultiSelect = "multi_select",
  File = "file",
}

export enum PropertyToolEnum {
  User = "user",
  Gemini15Pro = "gemini_1.5_pro",
  Gemini15Flash = "gemini_1.5_flash",
  Gpt4Omni = "gpt_4_omni",
  Gpt4OmniMini = "gpt_4_omni_mini",
  Gpt4Turbo = "gpt_4_turbo",
  Gpt35Turbo = "gpt_3.5_turbo",
  Claude35Sonnet = "claude_3.5_sonnet",
  Claude3Opus = "claude_3_opus",
  Claude3Haiku = "claude_3_haiku",
  Claude3Sonnet = "claude_3_sonnet",
}

export interface IProperty {
  projectId: mongoose.Types.ObjectId | string;
  name: string;
  description?: string;
  type: PropertyTypeEnum;
  prompt?: string;
  inputPropertyIds?: Array<mongoose.Types.ObjectId | string>;
  tool?: PropertyToolEnum;
  options?: Array<string>;
  userId: string;
  isDeleted?: boolean;
}

export interface IPropertyDocument extends IProperty {
  _id: mongoose.Types.ObjectId;
}

const propertySchema = new mongoose.Schema<IProperty>(
  {
    projectId: { type: mongoose.Schema.ObjectId, required: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: PropertyTypeEnum, required: true },
    prompt: { type: String },
    inputPropertyIds: [{ type: mongoose.Schema.ObjectId }],
    tool: { type: String, enum: Object.values(PropertyToolEnum) },
    options: [{ type: String }],
    userId: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    collection: "Properties",
  }
);

export const PropertyModel = coreDb.model("Property", propertySchema);
