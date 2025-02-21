import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware";
import chartController from "../controllers/chart.controller";

export const chartRouter = () => {
  const router = Router();
  router.get("/", verifyUser, chartController.transaction);
  return router;
};
