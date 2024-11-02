import { Router } from "express";
import asyncFunction from "express-async-handler";
import { ProjectController } from "../controllers/ProjectController";

export const projectApis = Router();

projectApis.post("/", asyncFunction(ProjectController.addProject));
projectApis.put("/:projectId", asyncFunction(ProjectController.updateProject));
projectApis.delete(
  "/:projectId",
  asyncFunction(ProjectController.deleteProject)
);
projectApis.get("/:projectId", asyncFunction(ProjectController.getProject));
projectApis.get("/all", asyncFunction(ProjectController.getAllProjects));
