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

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashService.updateEvent(req);
      responseHandler(res, "update success", result);
    } catch (error) {
      next(error);
    }
  }

  async getEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashService.getEvents(req);
      responseHandler(res, "fetching success", result);
    } catch (error) {
      next(error);
    }
  }

  async getEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashService.getEvent(req);
      responseHandler(res, "fetching success", result);
    } catch (error) {
      next(error);
    }
  }

  async updateTransaction(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await dashService.updateTransaction(req);
      responseHandler(res, "update success", result);
    } catch (error) {
      next(error);
    }
  }
}

export default new DashController();
