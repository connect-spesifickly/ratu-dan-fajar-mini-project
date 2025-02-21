import { Router } from "express";
import DashController from "../controllers/dash.controller";
import { verifyUser } from "../middleware/auth.middleware";

export const dashRouter = () => {
  const router = Router();
  router.get("/", verifyUser, DashController.dashInfo); // /api/dash/
  router.get("/events", verifyUser, DashController.getEvents); // /api/dash/events
  router.get("/event/:id", verifyUser, DashController.getEvent); // /api/dash/event/:id
  router.patch(
    "/transaction/:id",
    verifyUser,
    DashController.updateTransaction
  ); // /api/dash
  router.patch("/:id", verifyUser, DashController.updateEvent); // /api/dash/:id
  return router;
};
