import { Request, User } from 'model';
import { SecurityHandler } from 'handler/SecurityHandler';
import { Response } from 'express';
import mongoose from 'mongoose';

describe('SecurityHandler', () => {
  it('should populate req.user with the payload of a valid JWT', () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true,
    };
    const token = new User(user).generateAuthToken();

    // @ts-ignore
    const req: Request = {
      header: jest.fn().mockReturnValue(token),
    };

    // @ts-ignore
    const res: Response = {};
    const next = jest.fn();

    SecurityHandler(req, res, next);
    expect(req.user).toMatchObject(user);
  });
});
