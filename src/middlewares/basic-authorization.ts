import { ExpressMiddlewareInterface, Middleware } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { serverConfig } from '../configs/server-config';
import { Service } from 'typedi';

@Service()
@Middleware({ type: 'before' })
export class BasicAuthMiddleware implements ExpressMiddlewareInterface {
  public use(req: Request, res: Response, next: NextFunction): void {
    const basicAuth = serverConfig.basicAuth;
    const authHeader = req.headers['authorization'];

    if (authHeader && typeof authHeader === 'string') {
      const base64Credentials = authHeader.replace('Basic ', '');
      const credentials = Buffer.from(base64Credentials, 'base64').toString(
        'ascii'
      );
      const [username, password] = credentials.split(':');

      if (username === basicAuth.username && password === basicAuth.password) {
        return next(); // Authorization successful
      }
    }

    res.status(401).send({ message: 'Unauthorized' });
  }
}
