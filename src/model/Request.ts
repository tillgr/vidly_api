import { ParamsDictionary } from 'express-serve-static-core';
import { Request as IRequest } from 'express';

export interface Request<ReqBody = any, P = ParamsDictionary, ResBody = any>
  extends IRequest<P, ResBody, ReqBody> {}
