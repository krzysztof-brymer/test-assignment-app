/* eslint-disable @typescript-eslint/no-explicit-any */
import { ValidationError } from 'class-validator';
import { NextFunction, Request, Response } from 'express';
import {
  ExpressErrorMiddlewareInterface,
  HttpError,
  Middleware
} from 'routing-controllers';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'after' })
export class CustomErrorHandlerMiddleware
  implements ExpressErrorMiddlewareInterface
{
  error(error: any, _req: Request, res: Response, next: NextFunction): void {
    let status: number;
    let message: string;
    let errors = undefined;

    if (error instanceof HttpError) {
      console.log('here');
      if (error['errors'].every((err: any) => err instanceof ValidationError)) {
        errors = error['errors'].map((err: ValidationError) => {
          return {
            property: err.property,
            constraints: err.constraints
          };
        });

        status = error.httpCode;
        message = 'Body validation failed. Please check the request body.';
      }
    } else {
      status = error.status || 500;
      message = error.message || 'Something went wrong.';
    }

    res.status(status).json({
      status,
      message,
      errors
    });

    next();
  }
}
