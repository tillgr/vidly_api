import express, { Response } from 'express';
import { Movie, Rental, Request, Return, validateReturn } from 'model';
import { BodyHandler, SecurityHandler } from 'handler';

export const router = express.Router();

router.post(
  '/',
  [SecurityHandler, BodyHandler(validateReturn)],
  async (req: Request<Return>, res: Response<Rental | string>) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
    if (!rental) return res.status(404).send('Rental not found.');

    if (rental.dateReturned)
      return res.status(400).send('Return already processed.');

    rental.return();
    await rental.save();

    await Movie.updateOne(
      { _id: (rental.movie as Movie)._id },
      { $inc: { numberInStock: 1 } }
    );
    await rental.save();

    return res.send(rental);
  }
);
