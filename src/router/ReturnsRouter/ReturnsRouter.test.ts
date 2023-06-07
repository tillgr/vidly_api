import { server } from 'index';
import { Movie, MovieDocument, Rental, RentalDocument, User } from 'model';
import mongoose from 'mongoose';
import request from 'supertest';
import moment from 'moment';

describe('ReturnsRouter', () => {
  const agent = request(server);
  let token: string;
  let customerId: string | undefined;
  let movieId: string | undefined;
  let rental: RentalDocument;
  let movie: MovieDocument;

  const exec = async () => {
    return agent
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    token = new User().generateAuthToken();
    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();
    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345',
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2,
      },
    });
    await rental.save();

    movie = new Movie({
      _id: movieId,
      title: '12345',
      dailyRentalRate: 2,
      genre: { name: '12345' },
      numberInStock: 10,
    });
    await movie.save();
  });
  afterEach(async () => {
    await Rental.deleteMany({});
    await Movie.deleteMany({});
    server.close();
  });

  it('should return 401 if client is not logged in', async () => {
    token = '';
    const res = await exec();

    expect(res.status).toBe(401);
  });

  it('should return 400 if customerId is not provided', async () => {
    customerId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if movieId is not provided', async () => {
    movieId = '';
    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 400 if return is already processed', async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();

    expect(res.status).toBe(400);
  });

  it('should return 200 if request is valid', async () => {
    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the return date if request is valid', async () => {
    await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = +new Date() - +rentalInDb!.dateReturned!;
    expect(diff).toBeLessThan(10 * 1000);

    expect(rentalInDb!.dateReturned).toBeDefined();
  });

  it('should set the rentalFee if request is valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    await exec();
    const { rentalFee, movie } = (await Rental.findById(rental._id)) as Rental;

    expect(rentalFee).toBe(7 * movie.dailyRentalRate);
  });

  it('should increase the movie stock if request is valid', async () => {
    await exec();
    const { numberInStock } = (await Movie.findById(movieId)) as Movie;

    expect(numberInStock).toBe(movie.numberInStock + 1);
  });

  it('should the rental if request is valid', async () => {
    const res = await exec();

    await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        'dateOut',
        'dateReturned',
        'rentalFee',
        'customer',
        'movie',
      ])
    );
  });
});
