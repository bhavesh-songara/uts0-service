import { Router } from "express";
import { requiresAuth } from "express-openid-connect";

import { projectApis } from "./projectRoutes";
import { authApis } from "./authRoutes";
import { testApis } from "./testRoutes";
import { healthCheckApis } from "./healthCheckRoutes";
import { entityApis } from "./entityRoutes";
import { propertyApis } from "./propertyRoutes";
import { fieldApis } from "./fieldRoutes";

export const apis = Router();

// Auth APIs
apis.use("/auth", authApis);

// Core APIs
apis.use("/project", requiresAuth(), projectApis);
apis.use("/entity", requiresAuth(), entityApis);
apis.use("/property", requiresAuth(), propertyApis);
apis.use("/field", requiresAuth(), fieldApis);

// Test APIs
apis.use("/test", testApis);

// Health Check APIs
apis.use("/health", healthCheckApis);
