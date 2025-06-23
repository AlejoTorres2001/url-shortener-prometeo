import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { createApiResponse } from '../dto/api-response.dto';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    //!DEFAULT VALUES
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const { message: errorMessage, error } = exceptionResponse as any;
        message = Array.isArray(errorMessage)
          ? errorMessage.join(', ')
          : errorMessage || message;
        errorCode = error ? error : errorCode;
      } else {
        message = exceptionResponse as string;
      }
    } else if (exception instanceof Error) {
      message = exception.message;
    } else {
      //! NON HTTP OR ERROR EXCEPTION
      message = 'Unexpected error occurred';
    }

    //! CUSTOM ERROR CODES
    if (message === 'Entity not found') {
      errorCode = 'NOT_FOUND';
    }

    //LOG FOR BETTER TRACEABILITY
    this.logger.error(
      `Error in ${request.method} ${request.url}: ${message}`,
      exception instanceof Error ? exception.stack : '',
    );

    //! STANDARD RESPONSE
    const apiResponse = createApiResponse(false, message, null, errorCode);
    response.status(status).json(apiResponse);
  }
}
