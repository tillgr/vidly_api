import process from 'process';
import config from 'config';
import { logger } from './logging';
import debug from 'debug';

const init = () => {
  if (!process.env.SECRET_KEY) {
    throw new Error('FATAL ERROR: SECRET_KEY is not defined.');
  }

  logger.info('Application Name: ' + config.get('name'));
  logger.info('Mail Server: ' + config.get('mail.host'));

  if (process.env.NODE_ENV === 'development') {
    debug('app:startup')('Morgan enabled...');
  }
};

export default {
  init,
};
