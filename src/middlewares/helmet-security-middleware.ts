import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import express from 'express';
import helmet from 'helmet';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class HelmetSecurityMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    return helmet()(req, res, next);
  }
}
