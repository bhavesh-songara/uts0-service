import { Router } from "express";

import { projectApis } from "./projectRoutes";
import { authApis } from "./authRoutes";
import { testApis } from "./testRoutes";
import { healthCheckApis } from "./healthCheckRoutes";
import { entityApis } from "./entityRoutes";
import { propertyApis } from "./propertyRoutes";
import { fieldApis } from "./fieldRoutes";
import { ensureAuthenticated } from "../middlewares/auth";

export const apis = Router();

// Auth APIs
apis.use("/auth", authApis);

// Core APIs
apis.use("/project", ensureAuthenticated, projectApis);
apis.use("/entity", ensureAuthenticated, entityApis);
apis.use("/property", ensureAuthenticated, propertyApis);
apis.use("/field", ensureAuthenticated, fieldApis);

// Test APIs
apis.use("/test", testApis);

// Health Check APIs
apis.use("/health", healthCheckApis);
