import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { IUser } from '../utils/types/models.interface';

// Extend the Express Request interface to include a user property of type IUser
declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

// Check if the request is authenticated
export const isAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
): void | Response<any, Record<string, any>> => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res
      .status(401)
      .json({ message: 'Authorization header not provided' });
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res
      .status(401)
      .json({ message: 'Invalid authorization header format' });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      username: string;
    };
    req.user = decoded as IUser;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
