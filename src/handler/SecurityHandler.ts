import { NextFunction, Response } from 'express';
import { Request, User } from 'model';
import jwt from 'jsonwebtoken';
import * as process from 'process';

export type SecurityUser = jwt.JwtPayload | User;

export const SecurityHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {
    req.user = jwt.verify(token, process.env.SECRET_KEY!) as SecurityUser;
    return next();
  } catch (e) {
    return res.status(400).send('Invalid token.');
  }
};
