import { Request, Response, NextFunction } from 'express';
import { isUUID } from 'validator';
import { ExpressMiddlewareInterface } from 'routing-controllers';
import { Service } from 'typedi';

@Service()
export class ValidateUuidMiddleware implements ExpressMiddlewareInterface {
  use(req: Request, res: Response, next: NextFunction): void {
    const { id } = req.params;

    if (!isUUID(id)) {
      res.status(400).json({
        message: 'Invalid UUID format for parameter id.'
      });

      return;
    }

    next();
  }
}
