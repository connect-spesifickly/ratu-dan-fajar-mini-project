import { Request, Response, NextFunction } from "express";
import { responseHandler } from "../helpers/response.handler";
import dashService from "../services/dash.service";

class DashController {
  async dashInfo(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashService.dashInfo(req);
      responseHandler(res, "fetching success", result);
    } catch (error) {
      next(error);
    }
  }
}

export default new DashController();
