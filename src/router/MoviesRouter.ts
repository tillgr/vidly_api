import express, { Response } from 'express';
import { Genre, Movie, Request, RequestMovie, validateMovie } from 'model';

export const router = express.Router();

router.get('/', async (_req: Request, res: Response<Movie[]>) => {
  const movies = await Movie.find().sort('name');
  res.send(movies as Movie[]);
});

router.post(
  '/',
  async (req: Request<RequestMovie>, res: Response<Movie | string>) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { title, genreId, numberInStock, dailyRentalRate } = req.body;
    const genre = await Genre.findById(genreId);
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    const { _id, name } = genre;
    const movie = new Movie({
      title,
      genre: {
        _id,
        name,
      },
      numberInStock,
      dailyRentalRate,
    });
    await movie.save();

    return res.send(movie as Movie);
  }
);

router.put(
  '/:id',
  async (req: Request<RequestMovie>, res: Response<Movie | string>) => {
    const { error } = validateMovie(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { title, genreId, numberInStock, dailyRentalRate } = req.body;
    const genre = await Genre.findById(genreId);
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    const { _id, name } = genre;
    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        genre: {
          _id,
          name,
        },
        numberInStock,
        dailyRentalRate,
      },
      { new: true }
    );
    if (!movie)
      return res.status(404).send('The movie with the given ID was not found!');

    return res.send(movie as Movie);
  }
);

router.delete(
  '/:id',
  async (req: Request<Movie>, res: Response<Movie | string>) => {
    const movie = await Movie.findByIdAndRemove(req.params.id);
    if (!movie)
      return res.status(404).send('The movie with the given ID was not found!');

    return res.send(movie as Movie);
  }
);

router.get(
  '/:id',
  async (req: Request<Movie>, res: Response<Movie | string>) => {
    const movie = await Movie.findById(req.params.id);
    if (!movie)
      return res.status(404).send('The movie with the given ID was not found!');

    return res.send(movie as Movie);
  }
);
