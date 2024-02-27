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
import { CustomErrorHandler } from './middlewares/custom-error-handler';

export const routingControllerOptions: RoutingControllersOptions = {
  middlewares: [ValidateUuidMiddleware, CustomErrorHandler],
  controllers: [UserController],
  defaultErrorHandler: false,
  classTransformer: true
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
