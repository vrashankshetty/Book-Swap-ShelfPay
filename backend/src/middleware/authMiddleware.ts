import { Request, Response, NextFunction } from 'express';
import { getUsers } from '../db/database';

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const auth_header = req.headers.authorization;
  const userId = auth_header && auth_header.split(' ')[1];
  if (!userId) {
    res.status(401).json({ 
      success: false,
      message: 'Authentication required'
    });
    return;
  }
  
  const users = getUsers();
  const user = users.findOne({ $loki: parseInt(userId) });
  
  if (!user) {
    res.status(401).json({ 
      success: false,
      message: 'Invalid credentials.'
    });
    return;
  }
  
  req.user = user;
  next();
};


export const isOwner = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.user || req.user.role !== 'owner') {
    res.status(403).json({
      success: false,
      message: 'Access denied. Only book owners can perform this action.'
    });
    return;
  }
  next();
};
