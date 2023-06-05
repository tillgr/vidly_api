import express, { Response } from 'express';
import {
  Customer,
  Movie,
  Rental,
  Request,
  RequestRental,
  validateRental,
} from 'model';
import Fawn from 'fawn';

export const router = express.Router();

router.get('/', async (_req: Request, res: Response<Rental[]>) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.send(rentals as Rental[]);
});

router.post(
  '/',
  async (req: Request<RequestRental>, res: Response<Rental | string>) => {
    const { error } = validateRental(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { customerId, movieId } = req.body;

    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).send('Invalid movie.');
    const { name, phone } = customer;

    const movie = await Movie.findById(movieId);
    if (!movie) return res.status(404).send('Invalid customer.');
    const { title, dailyRentalRate } = movie;
    if (!movie.numberInStock)
      return res.status(400).send('Movie not in stock.');

    let rental = new Rental({
      customer: {
        _id: customerId,
        name,
        phone,
      },
      movie: {
        _id: movieId,
        title,
        dailyRentalRate,
      },
    });

    try {
      new Fawn.Task()
        .save('rentals', rental)
        .update('movies', { _id: movieId }, { $inc: { numberInStock: -1 } })
        .run();
    } catch (e) {
      res.status(500).send('Something failed...');
    }

    return res.send(rental as Rental);
  }
);
