// import * as winston from 'winston';

// export const winstonLogger = winston.createLogger({
//   transports: [
//     new winston.transports.Console({
//       format: winston.format.combine(
//         winston.format.colorize(),
//         winston.format.simple(),
//       ),
//     }),
//     new winston.transports.File({
//       filename: 'application.log',
//       format: winston.format.json(),
//     }),
//   ],
// });
import * as winston from 'winston';

// Định nghĩa custom levels cho phù hợp NestJS
const nestLikeLevels = {
  error: 0,
  warn: 1,
  log: 2,
  debug: 3,
  verbose: 4,
};

export const winstonLogger = winston.createLogger({
  levels: nestLikeLevels,
  level: 'debug', // hiển thị tất cả từ debug trở lên
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp(),
        winston.format.printf(
          ({ level, message, timestamp }) =>
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `[${timestamp}] ${level}: ${message}`,
        ),
      ),
    }),
    new winston.transports.File({
      filename: 'application.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    }),
  ],
});
