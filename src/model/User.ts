import { model, Schema } from 'mongoose';
import { Joi } from 'utils/validation';

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
};

export type RequestUser = Omit<User, '_id'>;
export type ResponseUser = Omit<User, 'password'>;

export const User = model<User>(
  'User',
  new Schema<User>({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    email: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 255,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 1024,
    },
  })
);

export const validateUser = (user: RequestUser) => {
  const schema = Joi.object<RequestUser>({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
};
