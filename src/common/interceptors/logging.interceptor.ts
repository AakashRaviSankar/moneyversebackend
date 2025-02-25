import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Observable } from 'rxjs';
  import { tap, catchError } from 'rxjs/operators';
  import { LoggingService } from '../logging/logging.service';
  
  @Injectable()
  export class LoggingInterceptor implements NestInterceptor {
    constructor(private readonly loggingService: LoggingService) {}
  
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const handlerName = context.getHandler().name;
      const className = context.getClass().name;
      const request = context.switchToHttp().getRequest();
      const requestBody = JSON.stringify(request.body);
  
      return next.handle().pipe(
        tap(async (data) => {
          const response = JSON.stringify(data);
          await this.loggingService.log(
            'info',
            `${className}.${handlerName}`,
            `${handlerName} executed successfully`,
            requestBody,
            response,
          );
        }),
        catchError(async (err) => {
          const error = err.stack || err.message;
          await this.loggingService.log(
            'error',
            `${className}.${handlerName}`,
            `${handlerName} failed`,
            requestBody,
            null,
            error,
          );
          throw err;
        }),
      );
    }
  }
  