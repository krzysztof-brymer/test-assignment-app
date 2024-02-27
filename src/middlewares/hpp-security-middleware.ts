import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import express from 'express';
import hpp from 'hpp';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class HppSecurityMiddleware implements ExpressMiddlewareInterface {
  public use(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): void {
    return hpp()(req, res, next);
  }
}
