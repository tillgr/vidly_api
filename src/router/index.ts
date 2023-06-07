import express from 'express';
import 'express-async-errors';
import { router as GenresRouter } from 'router/GenresRouter';
import { router as HomeRouter } from 'router/HomeRouter';
import { router as CustomersRouter } from 'router/CustomersRouter';
import { router as MoviesRouter } from 'router/MoviesRouter';
import { router as RentalsRouter } from 'router/RentalsRouter';
import { router as UsersRouter } from 'router/UsersRouter';
import { router as AuthenticationRouter } from 'router/AuthenticationRouter';
import { router as ReturnsRouter } from 'router/ReturnsRouter';

export const router = express.Router();

router.use('/', HomeRouter);
router.use('/api/genres', GenresRouter);
router.use('/api/customers', CustomersRouter);
router.use('/api/movies', MoviesRouter);
router.use('/api/rentals', RentalsRouter);
router.use('/api/users', UsersRouter);
router.use('/api/auth', AuthenticationRouter);
router.use('/api/returns', ReturnsRouter);
