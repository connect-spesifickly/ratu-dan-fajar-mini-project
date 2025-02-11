import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { jwt_secret, refresh_jwt_secret } from "../config";
import { ErrorHandler } from "../helpers/response.handler";
import { UserLogin } from "../interfaces/user.interface";

export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;
    const token = String(authorization || "").split("Bearer ")[1];
    const verifiedUser = verify(token, jwt_secret);
    if (!verifiedUser) {
      throw new ErrorHandler(401, "Unauthorized");
    }
    req.user = verifiedUser as UserLogin;
    next();
  } catch (error) {
    next(error);
  }
};

export const verifyRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { authorization } = req.headers;
    const token = String(authorization || "").split("Bearer ")[1];
    const verifiedUser = verify(token, refresh_jwt_secret);
    if (!verifiedUser) {
      throw new ErrorHandler(401, "Unauthorized");
    }
    req.user = verifiedUser as UserLogin;
    next();
  } catch (error) {
    next(error);
  }
};
