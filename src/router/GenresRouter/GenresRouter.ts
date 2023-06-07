import express, { Response } from 'express';
import { Genre, Request, RequestGenre, validateGenre } from 'model';
import {
  BodyHandler,
  ParamHandler,
  RoleHandler,
  SecurityHandler,
} from 'handler';
import mongoose from 'mongoose';

export const router = express.Router();

router.get('/', async (_req: Request, res: Response<Genre[]>) => {
  const genres = await Genre.find<Genre>().sort('name');
  res.send(genres as Genre[]);
});

router.post(
  '/',
  [SecurityHandler, BodyHandler(validateGenre)],
  async (req: Request<RequestGenre>, res: Response<Genre>) => {
    const { name } = req.body;
    const genre = new Genre({ name });
    await genre.save();

    return res.send(genre as Genre);
  }
);

router.put(
  '/:id',
  [ParamHandler, SecurityHandler, BodyHandler(validateGenre)],
  async (req: Request<RequestGenre>, res: Response<Genre | string>) => {
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
  [ParamHandler, SecurityHandler, RoleHandler],
  async (req: Request<Genre>, res: Response<RequestGenre | string>) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    return res.send(genre as Genre);
  }
);

router.get(
  '/:id',
  ParamHandler,
  async (req: Request<RequestGenre>, res: Response<Genre | string>) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id))
      return res.status(404).send('Invalid ID.');
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send('The genre with the given ID was not found!');

    return res.send(genre as Genre);
  }
);
