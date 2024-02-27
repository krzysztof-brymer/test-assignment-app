import 'reflect-metadata';
import Container from 'typedi';

import {
  RoutingControllersOptions,
  createExpressServer,
  useContainer
} from 'routing-controllers';
import { UserController } from './controllers/user-controller';
import { ValidateUuidMiddleware } from './middlewares/uuid-param-validator';
import { CustomErrorHandlerMiddleware } from './middlewares/custom-error-handler';
import { BasicAuthMiddleware } from './middlewares/basic-authorization';
import { HelmetSecurityMiddleware } from './middlewares/helmet-security-middleware';
import { HppSecurityMiddleware } from './middlewares/hpp-security-middleware';

useContainer(Container);

export const routingControllerOptions: RoutingControllersOptions = {
  middlewares: [
    BasicAuthMiddleware,
    ValidateUuidMiddleware,
    CustomErrorHandlerMiddleware,
    HelmetSecurityMiddleware,
    HppSecurityMiddleware
  ],
  controllers: [UserController],
  defaultErrorHandler: false,
  classTransformer: true,
  validation: true
};

const server = createExpressServer(routingControllerOptions);

export default server;
