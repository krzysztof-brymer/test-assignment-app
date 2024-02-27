import { serverConfig } from './configs/server-config';
import { dataSource } from './database/data-source';
import server from './server';
import { initializeDb } from './database/data-source';

const run = async (): Promise<void> => {
  await initializeDb({ dataSource: dataSource });

  await server.listen(serverConfig.port, () => {
    console.info(
      `⚡️[server]: server is running at http://${serverConfig.host}:${serverConfig.port}`
    );
  });
};

void run();
