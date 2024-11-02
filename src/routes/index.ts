import { Router } from "express";

import { projectApis } from "./projectRoutes";

export const apis = Router();

apis.use("/project", projectApis);
