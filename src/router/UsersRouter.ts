import express, { Response } from 'express';
import { Request, RequestUser, ResponseUser, User, validateUser } from 'model';
import bcrypt from 'bcrypt';
import { SecurityHandler } from 'handler';

export const router = express.Router();

router.get(
  '/me',
  SecurityHandler,
  async (req: Request, res: Response<ResponseUser>) => {
    res.send((await User.findById(req.user).select('-password'))!);
  }
);
router.post(
  '/',
  async (req: Request<RequestUser>, res: Response<ResponseUser | string>) => {
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    const { name, email, password } = req.body;
    user = new User({ name, email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const token = user.generateAuthToken();
    return res
      .header('x-auth-token', token)
      .send({ _id: user._id, name, email } as ResponseUser);
  }
);
