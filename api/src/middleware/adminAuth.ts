import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/User';

export const adminAuth = (req: Request & { user: IUser }, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}; 