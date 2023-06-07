import express, { Response } from 'express';
import { AuthUser, Request, User, validateAuthUser } from 'model';
import bcrypt from 'bcrypt';
import { BodyHandler } from 'handler';

export const router = express.Router();

router.post(
  '/',
  BodyHandler(validateAuthUser),
  async (req: Request<AuthUser>, res: Response<string>) => {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    return res.send(token);
  }
);
