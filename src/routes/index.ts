import { Router } from "express";

import { projectApis } from "./projectRoutes";
import { authApis } from "./authRoutes";
import { testApis } from "./testRoutes";
import { healthCheckApis } from "./healthCheckRoutes";

export const apis = Router();

// Auth APIs
apis.use("/auth", authApis);

// Core APIs
apis.use("/project", projectApis);

// Test APIs
apis.use("/test", testApis);

// Health Check APIs
apis.use("/health", healthCheckApis);
