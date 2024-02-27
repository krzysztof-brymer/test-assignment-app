import { serverConfig } from './configs/server-config';
import swaggerUiExpress from 'swagger-ui-express';
import server from './server';
import { dataSource } from './database/data-source';
import { initializeDb } from './database/data-source';
import { swaggerFile } from './configs/swagger-config';

const run = async (): Promise<void> => {
  await initializeDb({ dataSource: dataSource });

  server.use(
    '/docs',
    swaggerUiExpress.serve,
    swaggerUiExpress.setup(swaggerFile)
  );

  await server.listen(serverConfig.port, () => {
    console.info(
      `⚡️[server]: server is running at http://${serverConfig.host}:${serverConfig.port}`
    );
  });
};

void run();
