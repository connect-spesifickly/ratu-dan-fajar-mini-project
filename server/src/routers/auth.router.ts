import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { verifyRefreshToken, verifyUser } from "../middleware/auth.middleware";

export const authRouter = () => {
  const router = Router();
  router.post("/register", AuthController.register); // /api/auth/register
  router.post("/login", AuthController.login); // /api/auth/login
  router.post("/token", verifyRefreshToken, AuthController.refreshToken); // /api/auth/token
  router.patch("/", verifyUser, AuthController.updateUser); // /api/auth/:id
  return router;
};
