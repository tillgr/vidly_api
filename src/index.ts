import express from 'express';
import 'dotenv/config';
import helmet from 'helmet';
import morgan from 'morgan';
import debug from 'debug';
import { router } from 'router';
import { authenticator, logger } from 'handler';
import config from 'config';
import mongoose from 'mongoose';
import Fawn from 'fawn';

export const DB_PATH = 'mongodb://127.0.0.1:27017/vidly';
const startupDebugger = debug('app:startup');

const app = express();
app.set('view engine', 'pug');
app.set('views', './views'); //default

if (!process.env.SECRET_KEY) {
  console.error('FATAL ERROR: SECRET_KEY is not defined.');
  process.exit(1);
}

// db
mongoose
  .connect(DB_PATH)
  .then(() => console.log('Connected to MongoDB...'))
  .catch((e) => console.log('Could not connect to MongoDB...', e));
Fawn.init(DB_PATH);

app.use(express.json()); //populates req.body
app.use(express.urlencoded({ extended: true })); //key=value&key=value
app.use(express.static('public'));
app.use(helmet());
app.use(router);

// Configuration
console.log('Application Name: ' + config.get('name'));
console.log('Mail Server: ' + config.get('mail.host'));
// console.log('Mail Password: ' + config.get('mail.password'));

const isDev = app.get('env') === 'development';
isDev && app.use(morgan('tiny')) && startupDebugger('Morgan enabled...');

app.use(logger);
app.use(authenticator);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
