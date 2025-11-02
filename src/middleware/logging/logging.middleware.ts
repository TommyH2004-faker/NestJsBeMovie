import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import '../../types/express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const isAuth = true;
    if (!isAuth) {
      return res.status(HttpStatus.UNAUTHORIZED).json({
        message: 'Unauthorized',
      });
    }

    req.user = {
      id: 1,
      username: 'minhhiep',
      email: 'hiep@example.com',
    };

    next();
  }
}
