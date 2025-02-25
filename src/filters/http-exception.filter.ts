import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    console.log(exception);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    // Avoid sending a response if headers are already sent
    if (response.headersSent) {
      return;
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'An unexpected error occurred';

    const errorResponse = {
      success: false,
      statusCode: status,
      message:
        typeof message === 'string'
          ? message
          : (message as any).message || 'An unexpected error occurred',
    };

    response.status(status).json(errorResponse);
  }
}
