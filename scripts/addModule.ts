import * as fs from "fs";
import * as path from "path";
import { text, intro, outro, cancel, isCancel } from "@clack/prompts";

(async () => {
  intro("Module Creation Script");

  const moduleName = await text({
    message:
      "Enter the module name e.g. EmissionActivity, ActivityUnit, ChatSession, etc:",
  });

  if (isCancel(moduleName)) {
    cancel("Operation cancelled.");
    process.exit(0);
  }

  const camelCaseModuleName =
    moduleName.charAt(0).toLowerCase() + moduleName.slice(1);

  const serviceName = `${moduleName}Service.ts`;
  const controllerName = `${moduleName}Controller.ts`;
  const routeName = `${camelCaseModuleName}Routes.ts`;
  const serviceDir = path.join(__dirname, "../src/services");
  const controllerDir = path.join(__dirname, "../src/controllers");
  const routeDir = path.join(__dirname, "../src/routes");
  const serviceFilePath = path.join(serviceDir, serviceName);
  const controllerFilePath = path.join(controllerDir, controllerName);
  const routeFilePath = path.join(routeDir, routeName);

  if (!fs.existsSync(serviceDir)) {
    fs.mkdirSync(serviceDir, { recursive: true });
  }

  if (!fs.existsSync(controllerDir)) {
    fs.mkdirSync(controllerDir, { recursive: true });
  }

  if (!fs.existsSync(routeDir)) {
    fs.mkdirSync(routeDir, { recursive: true });
  }

  const serviceClassContent = `// Add your service methods here
export class ${moduleName}Service {
  
}`;

  const controllerClassContent = `import { Request, Response } from 'express';
import Joi from 'joi';

import { validateJoiSchema } from '../utils/validateJoiSchema';
import {${moduleName}Service} from "../services/${serviceName?.replace(
    ".ts",
    ""
  )}"; 

  // Add your controller methods here
export class ${moduleName}Controller {
}`;

  const routeClassContent = `import { Router } from 'express';
import asyncFunction from 'express-async-handler';
import { ${moduleName}Controller } from '../controllers/${controllerName?.replace(
    ".ts",
    ""
  )}';

export const ${camelCaseModuleName}Apis = Router();

// Define your routes here
`;

  fs.writeFileSync(serviceFilePath, serviceClassContent);
  fs.writeFileSync(controllerFilePath, controllerClassContent);
  fs.writeFileSync(routeFilePath, routeClassContent);

  // Append the new route to routes/index.ts
  const routesIndexPath = path.join(__dirname, "../src/routes/index.ts");
  const newRouteLine = `import { ${camelCaseModuleName}Apis } from './${routeName?.replace(
    ".ts",
    ""
  )}';\n`;
  const useRouteLine = `apis.use('/${camelCaseModuleName}', ${camelCaseModuleName}Apis);\n`;

  fs.appendFileSync(routesIndexPath, newRouteLine);
  fs.appendFileSync(routesIndexPath, useRouteLine);

  outro("Module files created successfully.");
})();
