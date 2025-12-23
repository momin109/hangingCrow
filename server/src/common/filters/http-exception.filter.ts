import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from '@types/express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';
        let error = 'Internal Server Error';

        if (exception instanceof HttpException) {
            status = exception.getStatus();
            const exceptionResponse = exception.getResponse();

            if (typeof exceptionResponse === 'string') {
                message = exceptionResponse;
            } else if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
                const responseObj = exceptionResponse as any;
                message = responseObj.message || exception.message;
                error = responseObj.error || error;
            } else {
                message = exception.message;
            }
        } else if (exception instanceof Error) {
            message = exception.message;
            error = 'Error';
        }

        // Log error in production (you might want to use a proper logger)
        if (process.env.NODE_ENV === 'production') {
            console.error('Exception:', {
                status,
                message,
                path: request.url,
                method: request.method,
                timestamp: new Date().toISOString(),
            });
        } else {
            console.error('Exception:', exception);
        }

        // Don't expose internal errors in production
        const isDevelopment = process.env.NODE_ENV !== 'production';
        const finalMessage = status === HttpStatus.INTERNAL_SERVER_ERROR && !isDevelopment
            ? 'An unexpected error occurred. Please try again later.'
            : message;

        response.status(status).json({
            statusCode: status,
            message: finalMessage,
            error: status === HttpStatus.INTERNAL_SERVER_ERROR && !isDevelopment ? 'Internal Server Error' : error,
            timestamp: new Date().toISOString(),
            path: request.url,
        });
    }
}

