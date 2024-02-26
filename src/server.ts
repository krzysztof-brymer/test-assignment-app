import 'reflect-metadata';
import Container from 'typedi';

import { ServerConfig } from './config/serverConfig';
import {
  RoutingControllersOptions,
  createExpressServer,
  useContainer
} from 'routing-controllers';

export const routingControllerOptions: RoutingControllersOptions = {
  middlewares: [],
  controllers: [],
  classTransformer: true
};

export const createServer = ({
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
