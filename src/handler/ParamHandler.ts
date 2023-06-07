import { Request } from 'model';
import { NextFunction, Response } from 'express';
import mongoose from 'mongoose';

export const ParamHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(404).send('Invalid ID.');

  return next();
};
