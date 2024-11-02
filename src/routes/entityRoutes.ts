import { Router } from "express";
import asyncFunction from "express-async-handler";

import { EntityController } from "../controllers/EntityController";

export const entityApis = Router();

// Define your routes here
entityApis.post("/", asyncFunction(EntityController.addEntity));
entityApis.delete("/:entityId", asyncFunction(EntityController.deleteEntity));
entityApis.get("/:entityId", asyncFunction(EntityController.getEntity));
entityApis.get(
  "/project/:projectId",
  asyncFunction(EntityController.getEntities)
);
