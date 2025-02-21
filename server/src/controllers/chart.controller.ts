import { NextFunction, Request, Response } from "express";
import { ErrorHandler, responseHandler } from "../helpers/response.handler";
import AuthService from "../services/auth.service";
import RewardsController from "../services/rewards.service";
import chartServices from "../services/chart.services";

class ChartController {
  async transaction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await chartServices.transaction(req);
      responseHandler(res, "Transaction Chart success", result);
    } catch (error) {
      next(error);
    }
  }
}

export default new ChartController();
