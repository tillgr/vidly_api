import { NextFunction, Request, Response } from 'express';

export const logger = (_req: Request, _res: Response, next: NextFunction) => {
  console.log('Logging'); //req.body
  next();
};
