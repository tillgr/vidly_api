import { Document, model, Schema } from 'mongoose';
import { Genre, genreSchema } from 'model/Genre';
import { Joi } from 'utils/validation';

export type Movie = {
  _id: string;
  title: string;
  genre: Genre;
  numberInStock: number;
  dailyRentalRate: number;
};

export type MovieDocument = Document<unknown, {}, Movie> &
  Omit<Movie & Required<{ _id: string }>, never>;

export type RequestMovie = Omit<Movie, 'genre'> & {
  genreId: string;
};

export const Movie = model<Movie>(
  'Movie',
  new Schema<Movie>({
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
    },
    genre: {
      type: genreSchema,
      required: true,
    },
    numberInStock: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
    dailyRentalRate: {
      type: Number,
      required: true,
      min: 0,
      max: 255,
    },
  })
);

export const validateMovie = (movie: RequestMovie) => {
  const schema = Joi.object<RequestMovie>({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required(),
  });
  return schema.validate(movie);
};
