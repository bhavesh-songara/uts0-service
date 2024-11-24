import { Router } from "express";
import asyncFunction from "express-async-handler";
import { FieldController } from "../controllers/FieldController";

export const fieldApis = Router();

// Define your routes here
fieldApis.put("/", asyncFunction(FieldController.updateField));
