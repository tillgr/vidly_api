import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import morgan from 'morgan';
import { router } from 'router';

import { ErrorHandler } from 'handler';
import database from 'utils/database';
import config from 'utils/config';
import { logger } from 'utils/logging';
import process from 'process';

const app = express();
app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.json()); //populates req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(helmet());
app.use(router);
app.use(morgan('tiny'));
database.connect();
config.init();

app.use(ErrorHandler);

const port = process.env.PORT || 3000;
export const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);
