import {
  Catch,
  ExceptionFilter,
  HttpException,
  ArgumentsHost,
} from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const response = ctx.getResponse();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = ctx.getRequest();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      path: request.url,
      error: exceptionResponse,
    });
  }
}
