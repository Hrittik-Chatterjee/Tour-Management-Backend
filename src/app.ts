import express, { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes";
import cors from "cors";
import { router } from "./app/modules/routes";
// import { envVars } from "./app/config/env";
import { globalErrorHanlder } from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
const app = express();

app.use(express.json());
app.use(cors());
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    messege: "hello welcome to tour management backend",
  });
});

app.use(globalErrorHanlder);

app.use(notFound);

export default app;
