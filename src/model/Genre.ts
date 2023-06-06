import { Document, model, Schema } from 'mongoose';
import { Joi } from 'utils/validation';

export type Genre = {
  _id: string;
  name: string;
};

export type GenreDocument = Document<unknown, {}, Genre> &
  Omit<Genre & Required<{ _id: string }>, never>;

export type RequestGenre = Omit<Genre, '_id'>;

export const genreSchema = new Schema<Genre>({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
});

export const Genre = model<Genre>('Genre', genreSchema);

export const validateGenre = (genre: RequestGenre) => {
  const schema = Joi.object<RequestGenre>({
    name: Joi.string().min(5).max(50).required(),
  });
  return schema.validate(genre);
};
