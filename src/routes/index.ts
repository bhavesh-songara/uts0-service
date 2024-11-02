import { Router } from "express";

import { projectApis } from "./projectRoutes";
import { authApis } from "./authRoutes";

export const apis = Router();

apis.use("/project", projectApis);
apis.use("/auth", authApis);
