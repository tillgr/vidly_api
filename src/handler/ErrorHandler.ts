import { NextFunction, Request, Response } from 'express';

import { logger } from 'utils/logging';

export const ErrorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, err);
  res.status(500).send('Something failed.');
  next();
};
