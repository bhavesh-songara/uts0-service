import express from "express";
import cors from "cors";

import { contextMiddleware } from "./utils/logger";
import { errorHandler, notFoundHandler, requestLogger } from "./middlewares";
// import { apis } from "./routes";

// Initializing express application
const app = express();

app.use(cors());

app.use(contextMiddleware);
app.use(requestLogger);

// app.use("/api", apis);
// app.use("*", notFoundHandler);
// app.use(errorHandler);

export default app;
