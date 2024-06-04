import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_ACCESS_SECRET } from "../config";
const prismaService = new PrismaClient();
interface AuthenticatedRequest extends Request {
    user?: any; // Define the 'user' property as optional and of any type
  }
export const authenticateToken1 = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
    const authHeader = req.headers["authorization"];
    if (authHeader) {
      const token = authHeader && authHeader.split(" ")[1];
  
      if (token == null) return res.sendStatus(401);
  
      jwt.verify(token, JWT_ACCESS_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
      });
    } else {
      res.sendStatus(401);
    }
};

export const user = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'USER') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as a user' });
    }
  };
  
  export const admin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as an admin' });
    }
  };
  
  export const superAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      next();
    } else {
      res.status(403).json({ message: 'Not authorized as a super admin' });
    }
  };

  export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user?.role!)) {
        return res.status(403).json({ message: 'Insufficient role' });
      }
      next();
    };
  };