import winston from 'winston'

const levels = {
    debug: 0,
    http: 1,
    info: 2,
    warning: 3,
    error: 4,
    fatal: 5,
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
      winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
              winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              winston.format.printf((info) => {
                return `[${info.timestamp}] ${info.level}: ${info.message}`;
              })
            ),
        level: 'debug',
      }),
      new winston.transports.File({
        filename: './errors.log',
        format: winston.format.combine(
          winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
          winston.format.printf((info) => {
            return `[${info.timestamp}] ${info.level}: ${info.message}`;
          })
        ),
        level: 'error',
      }),
    ],
});

export const addLogger = (req, res, next) => {
    req.logger = logger
    req.logger.http(`[${req.method}] ${req.url} - ${new Date().toLocaleDateString()}`)
    next()
}

