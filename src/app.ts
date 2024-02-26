import { serverConfig } from './configs/server-config';
import { dataSource } from './database/data-source';
import { createServer } from './server';
import { initializeDb } from './database/data-source';

const run = async (): Promise<void> => {
  await initializeDb({ dataSource: dataSource });

  await createServer({ serverConfig: serverConfig });
};

void run();
