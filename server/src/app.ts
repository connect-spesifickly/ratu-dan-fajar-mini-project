import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import { PORT } from "./config";
import { ErrorHandler } from "./helpers/response.handler";
import { authRouter } from "./routers/auth.router";
import { dashRouter } from "./routers/dash.router";
import { chartRouter } from "./routers/chart.router";

export class App {
  public app: Application;
  constructor() {
    this.app = express();
    this.configure();
    this.routes();
    this.handleError();
  }

  private routes() {
    this.app.use("/api/auth", authRouter());
    this.app.use("/api/dash", dashRouter());
    this.app.use("/api/chart", chartRouter());
  }

  private configure() {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private handleError() {
    //not found handler
    this.app.use((req: Request, res: Response, next: NextFunction) => {
      res.status(404).json({ message: "Not Found" });
    });

    //error handler
    this.app.use(
      (err: ErrorHandler, req: Request, res: Response, next: NextFunction) => {
        res.status(err.code || 500).json({ message: err.message });
      }
    );
  }

  start() {
    this.app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  }
}
