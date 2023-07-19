import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// define structure for currentUser data
interface UserPayLoad {
  id: string;
  email: string;
}

// add a custom property "currentUser" to the express req method
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayLoad;
    }
  }
}

export const currentUserSession = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // check if jwt property set 
  if (!req.session?.jwt) {
    return next();
  }

  try {
    // verify jwt data to jwt key for verification 
    const payload = jwt.verify(
      req.session.jwt,
      process.env.JWT_KEY!
    ) as UserPayLoad;
    // upon successful verification we set custom property to payload data
    req.currentUser = payload;
  } catch (err) {}
  next();
};
