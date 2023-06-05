import express, { Response } from 'express';
import { Genre, Request, RequestGenre, validateGenre } from 'model';

export const router = express.Router();

router.get('/', async (_req: Request, res: Response<Genre[]>) => {
  const genres = await Genre.find<Genre>().sort('name');
  res.send(genres as Genre[]);
});

router.post(
  '/',
  async (req: Request<RequestGenre>, res: Response<Genre | string>) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name } = req.body;
    const genre = new Genre({ name });
    await genre.save();

    return res.send(genre as Genre);
  }
);

router.put(
  '/:id',
  async (req: Request<RequestGenre>, res: Response<Genre | string>) => {
    const { error } = validateGenre(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name } = req.body;
    const genre = await Genre.findByIdAndUpdate(
      req.params.id,
      { name },
      { new: true }
    );
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    return res.send(genre as Genre);
  }
);

router.delete(
  '/:id',
  async (req: Request<Genre>, res: Response<RequestGenre | string>) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    return res.send(genre as Genre);
  }
);

router.get(
  '/:id',
  async (req: Request<RequestGenre>, res: Response<Genre | string>) => {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    return res.send(genre as Genre);
  }
);