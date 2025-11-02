import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    console.log(`[Logger] ${req.method} ${req.originalUrl}`);
    next();
  }
}
