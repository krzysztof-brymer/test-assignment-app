import { serverConfig } from "./config/serverConfig";
import { AppDataSource } from "./dataSource";
import { createServer } from "./server";
import { initializeDb } from "./dataSource";

const run = async (): Promise<void> => {
  await initializeDb({ dataSource: AppDataSource });

  createServer({ serverConfig: serverConfig });
};

void run();
