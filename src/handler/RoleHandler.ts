import { Request } from 'model';
import { NextFunction, Response } from 'express';

export const RoleHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.isAdmin) return res.status(403).send('Access denied.');

  return next();
};
