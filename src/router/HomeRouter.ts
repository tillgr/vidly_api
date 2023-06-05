import express, { Request, Response } from 'express';

export const router = express.Router();

router.get('/', (_req: Request, res: Response) =>
  res.render('index', { title: 'My Express App', message: 'Hello' })
);
