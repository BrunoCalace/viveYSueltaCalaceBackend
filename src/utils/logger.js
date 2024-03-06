import winston from 'winston'

const levels = {
  fatal: 0,
  error: 1,
  warning: 2,
  info: 3,
  http: 4,
  debug: 5,
}

const colors = {
  debug: 'blue',
  http: 'green',
  info: 'cyan',
  warning: 'yellow',
  error: 'red',
  fatal: 'magenta',
}

export const logger = winston.createLogger({
  levels,
  format: winston.format.combine(
    winston.format.colorize({ all: true }),
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf((info) => {
      return `[${info.timestamp}] ${info.level}: ${info.message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
        level: 'debug',
    }),
    new winston.transports.File({
      filename: './errors.log',
      level: 'error',
    }),
  ],
});

export const addLogger = (req, res, next) => {
  req.logger = logger
  req.logger.http(`[${req.method}] ${req.url}`)
  next()
};

