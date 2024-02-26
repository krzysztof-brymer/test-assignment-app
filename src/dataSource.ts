import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";
import { dbConfig } from "./config/dbConfig";

export const AppDataSource = new DataSource({
  ...dbConfig,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export const initializeDb = async ({
  dataSource,
}: {
  dataSource: DataSource;
}): Promise<void> => {
  await dataSource
    .initialize()
    .then(() => {
      console.info(`⚡️[db]: ${dataSource.options.type} DB connected.`);
    })
    .catch((error) => console.error("Failed to connect to DB.", error));
};
