import config from 'config';
import Fawn from 'fawn';
import mongoose from 'mongoose';
import { logger } from './logging';

const DB_PATH: string = config.get('db');

const connect = () => {
  mongoose.connect(DB_PATH).then(() => logger.info('Connected to MongoDB...'));
  Fawn.init(DB_PATH);
};

export default {
  connect,
};
