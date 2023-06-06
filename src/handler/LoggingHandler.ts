import { NextFunction, Request, Response } from 'express';

export const LoggingHandler = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log('Logging'); //req.body
  next();
};
