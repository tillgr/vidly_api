import { model, Schema } from 'mongoose';
import Joi from 'joi';
import { ObjectId } from 'mongodb';

export type Customer = {
  _id: ObjectId;
  name: string;
  isGold?: boolean;
  phone: string;
};

export type RequestCustomer = Omit<Customer, '_id'>;
export const Customer = model<Customer>(
  'Customer',
  new Schema<Customer>({
    name: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
    isGold: {
      type: Boolean,
      default: false,
    },
    phone: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 50,
    },
  })
);

export const validateCustomer = (customer: RequestCustomer) => {
  const schema = Joi.object<RequestCustomer>({
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
};
