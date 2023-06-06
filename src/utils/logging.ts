import winston, { format, transports } from 'winston';
import 'winston-mongodb';

const customFormat = format.printf(({ timestamp, level, message }) => {
  return `${timestamp} ${level}: ${message}`;
});

const timeFormat = format.timestamp({
  format: 'YYYY-MM-DD HH:mm:ss',
});

export const logger = winston.createLogger({
  format: format.combine(
    timeFormat,
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
    format.metadata()
  ),
  transports: [
    new winston.transports.File({
      filename: './log/logfile.log',
      level: 'error',
    }),
    // new winston.transports.MongoDB({ db: config.get('db'), level: 'error' }),
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.combine(timeFormat, customFormat)
      ),
      level: 'info',
    }),
  ],
  exceptionHandlers: [
    new transports.File({ filename: './log/exceptions.log' }),
  ],
  rejectionHandlers: [
    new transports.File({ filename: './log/rejections.log' }),
  ],
});
