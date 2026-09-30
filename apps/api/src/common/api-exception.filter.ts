import {
  ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiError, ErrorCode } from '@badabing/shared';

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();
    const body = this.toApiError(exception);

    if (body.statusCode >= 500) {
      this.logger.error(body.message, exception instanceof Error ? exception.stack : undefined);
    }

    response.status(body.statusCode).json(body);
  }

  private toApiError(exception: unknown): ApiError {
    if (!(exception instanceof HttpException)) {
      return {
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        code: ErrorCode.INTERNAL_ERROR,
        message: 'Internal server error',
      };
    }

    const statusCode = exception.getStatus();
    const res = exception.getResponse();

    if (typeof res === 'object' && res !== null && 'code' in res) {
      const { code, message, details } = res as Partial<ApiError>;
      return {
        statusCode,
        code: code ?? ErrorCode.UNKNOWN_ERROR,
        message: message ?? exception.message,
        ...(details && { details }),
      };
    }

    return {
      statusCode,
      code: statusCode === HttpStatus.BAD_REQUEST
        ? ErrorCode.VALIDATION_FAILED
        : ErrorCode.UNKNOWN_ERROR,
      message: typeof res === 'string' ? res : exception.message,
    };
  }
}