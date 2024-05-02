import { NextFunction, Request, Response } from "express";
import { config } from "../../config";
import { JwtPayload, verify } from "jsonwebtoken";

const JWT_SECRET_KEY = config.JWT_SECRET_KEY;

const authMiddleware = function (req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization;
    const tokenToVerify = token?.split(" ")[1];

    const payload = verify(tokenToVerify!, JWT_SECRET_KEY) as JwtPayload;

    if (payload) {
      const userId = payload.userId;
      res.locals.userId = userId;
      next();
    }
  } catch (error) {
    res.status(403).json({
      message: "Please provide valid token",
    });
  }
};

export default authMiddleware;
