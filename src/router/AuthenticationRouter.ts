import express, { Response } from 'express';
import { Request, RequestUser, User } from 'model';
import bcrypt from 'bcrypt';
import { Joi } from 'utils/validation';
import jwt from 'jsonwebtoken';

export const router = express.Router();

router.post('/', async (req: Request<RequestUser>, res: Response) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY!);
  return res.send(token);
});

const validate = (requestUser: RequestUser) => {
  const schema = Joi.object<RequestUser>({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(requestUser);
};
