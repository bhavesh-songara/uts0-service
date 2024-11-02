import { Router } from "express";
import asyncFunction from "express-async-handler";
import { PropertyController } from "../controllers/PropertyController";

export const propertyApis = Router();

// Define your routes here
propertyApis.post("/", asyncFunction(PropertyController.addProperty));
propertyApis.put(
  "/:propertyId",
  asyncFunction(PropertyController.updateProperty)
);
propertyApis.delete(
  "/:propertyId",
  asyncFunction(PropertyController.deleteProperty)
);
propertyApis.get("/:propertyId", asyncFunction(PropertyController.getProperty));
propertyApis.get(
  "/all/:projectId",
  asyncFunction(PropertyController.getAllProperties)
);
