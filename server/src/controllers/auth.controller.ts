import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import AuthService from "../services/auth.service";
import RewardsController from "../services/rewards.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Request body:", req.body); // untuk cek apakah request body masuk
      console.log("Received email:", req.body.email); // Log email yang dikirimkan
      const result = await AuthService.register(req.body);
      //menambahkan poin dan kupon bila referral code sama
      if (req.body.applied_reference_code)
        await RewardsController.getKuponAndPoin(req.body);
      responseHandler(res, "register success");
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.login(req.body);
      responseHandler(res, "login success", result);
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.updateUser(req);
      responseHandler(res, "update success", result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await AuthService.refreshToken(req);
      responseHandler(res, "refresh token success", result);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
