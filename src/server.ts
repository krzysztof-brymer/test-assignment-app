import 'reflect-metadata';
import Container from 'typedi';

import { ServerConfig } from './configs/server-config';
import {
  RoutingControllersOptions,
  createExpressServer,
  useContainer
} from 'routing-controllers';
import { UserController } from './controllers/user-controller';
import { ValidateUuidMiddleware } from './middlewares/uuid-param-validator';
import { CustomErrorHandlerMiddleware } from './middlewares/custom-error-handler';
import { BasicAuthMiddleware } from './middlewares/basic-authorization';

export const routingControllerOptions: RoutingControllersOptions = {
  middlewares: [
    BasicAuthMiddleware,
    ValidateUuidMiddleware,
    CustomErrorHandlerMiddleware
  ],
  controllers: [UserController],
  defaultErrorHandler: false,
  classTransformer: true,
  validation: true
};

export const createServer = async ({
  serverConfig
}: {
  serverConfig: ServerConfig;
}) => {
  useContainer(Container);

  const app = createExpressServer(routingControllerOptions);

  return app.listen(serverConfig.port, () => {
    console.info(
      `⚡️[server]: server is running at http://${serverConfig.host}:${serverConfig.port}`
    );
  });
};
