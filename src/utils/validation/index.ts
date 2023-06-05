import IJoi from 'joi';
import Joi_oid from 'joi-objectid';

type Joi = IJoi.Root & { objectId: () => IJoi.AnySchema };

export const Joi: Joi = {
  ...IJoi,
  objectId: Joi_oid(IJoi),
};
