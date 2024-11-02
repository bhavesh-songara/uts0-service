import { Router } from "express";

export const healthCheckApis = Router();

healthCheckApis.get("/", (req, res) => {
  res.send({
    message: "Hello World",
  });
});
