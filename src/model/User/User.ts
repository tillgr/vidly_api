import { Model, model, Schema } from 'mongoose';
import { Joi } from 'utils/validation';
import jwt from 'jsonwebtoken';

export type User = {
  _id: string;
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
};
type UserMethods = {
  generateAuthToken: () => string;
};
export type UserModel = Model<User, {}, UserMethods>;

export type RequestUser = Omit<User, '_id'>;
export type AuthUser = Pick<User, 'email' | 'password'>;
export type ResponseUser = Omit<User, 'password'>;

const userSchema = new Schema<User, UserModel, UserMethods>({
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
  isAdmin: {
    type: Boolean,
  },
});

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.SECRET_KEY!
  );
};

export const User = model<User, UserModel>('User', userSchema);

export const validateUser = (user: RequestUser) => {
  const schema = Joi.object<RequestUser>({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
};

export const validateAuthUser = (user: AuthUser) => {
  const schema = Joi.object<AuthUser>({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(user);
};
