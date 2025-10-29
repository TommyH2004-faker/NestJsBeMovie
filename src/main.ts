import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { HttpExceptionFilter } from './exceptions/http-exception.filter';
import { LoggerMiddleware } from './middleware/logger/logger.middleware';
import { winstonLogger } from './logger/winston.logger';
import * as cookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: winstonLogger,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  // eslint-disable-next-line @typescript-eslint/unbound-method
  app.use(new LoggerMiddleware().use);
  app.useGlobalFilters(new HttpExceptionFilter());
  // app.useLogger(['log']);
  // main.ts
  // BẮT BUỘC: dùng cookie-parser
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  app.use(cookieParser());
  app.enableCors({
    origin: 'http://localhost:8080', // domain FE
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false,
      exceptionFactory: (validationErrors: ValidationError[] = []) => {
        const errors = validationErrors.map((error) => {
          const constraints = error.constraints
            ? Object.values(error.constraints)
            : ['Invalid input'];
          return {
            field: error.property,
            errors: constraints,
          };
        });

        return new BadRequestException({
          message: 'Validation failed',
          errors,
        });
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
