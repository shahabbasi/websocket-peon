/*
Uncomment if you're not injecting your envs anywhere else.
// import dotenv from 'dotenv';
// dotenv.config();
*/
import winston from 'winston';
import Sentry from 'winston-sentry-log';
const format = winston.format;
const { timestamp, printf } = format;


const sentryOptions = {
  config: {
    dsn: process.env.SENTRY_DSN,
  },
  level: 'error',
};

const logFileFormat = format.combine(
  timestamp(),
  format.json(),
);

const logConsoleFormat = format.combine(
  timestamp(),
  printf(({ level, message, timestamp: ts }) => {
    return `{"ts": "${ts}", "level": "${level}", "data": "${message}"`;
  }),
);

const winstonLogger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: logFileFormat,
  defaultMeta: { service: process.env.APP_NAME },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV === 'production') {
  winstonLogger.add(new Sentry(sentryOptions));
}

if (!['production'].includes(process.env.NODE_ENV)) {
  winstonLogger.add(new winston.transports.Console({
    format: logConsoleFormat,
  }));
}

const customLogger: any = {};

customLogger.info = (...data) => {
  winstonLogger.info(JSON.stringify(data));
};

customLogger.log = customLogger.info;

customLogger.error = (data) => {
  if (data.message) winstonLogger.log({ level: 'error', message: data.stack });
  winstonLogger.error(JSON.stringify(data));
};

customLogger.warn = (...data) => {
  winstonLogger.warn(JSON.stringify(data));
};


export default customLogger;
