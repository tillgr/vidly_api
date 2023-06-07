import { Joi } from 'utils/validation';
import { ObjectId } from 'mongodb';

export type Return = {
  customerId: ObjectId;
  movieId: ObjectId;
};

export const validateReturn = (_return: Return) => {
  const schema = Joi.object<Return>({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });
  return schema.validate(_return);
};
