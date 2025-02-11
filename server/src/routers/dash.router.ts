import { Router } from "express";
import DashController from "../controllers/dash.controller";
import { verifyUser } from "../middleware/auth.middleware";

export const dashRouter = () => {
  const router = Router();
  router.get("/", verifyUser, DashController.dashInfo); // /api/dash/
  return router;
};
