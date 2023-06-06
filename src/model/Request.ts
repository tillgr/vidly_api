import { ParamsDictionary } from 'express-serve-static-core';
import { Request as IRequest } from 'express';
import { SecurityUser } from 'handler';

export interface Request<ReqBody = any, P = ParamsDictionary, ResBody = any>
  extends IRequest<P, ResBody, ReqBody> {
  user?: SecurityUser;
}
