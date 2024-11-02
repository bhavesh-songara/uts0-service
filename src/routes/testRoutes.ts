import { Router } from "express";

export const testApis = Router();

testApis.get("/", (req, res) => {
  res.send({
    message: "Hello World",
  });
});
