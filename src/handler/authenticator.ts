import { NextFunction, Request, Response } from 'express';

export const authenticator = (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  console.log('Authenticating');
  next();
};
