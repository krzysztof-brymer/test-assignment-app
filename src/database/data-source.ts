import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entities/User';
import { dbConfig } from '../configs/db-config';
import { CreateUserTable1708975641643 } from './migrations/1708975641643-CreateUserTable';

export const dataSource = new DataSource({
  ...dbConfig,
  entities: [User],
  migrations: [CreateUserTable1708975641643],
  subscribers: []
});

export const initializeDb = async ({
  dataSource
}: {
  dataSource: DataSource;
}): Promise<void> => {
  await dataSource
    .initialize()
    .then(() => {
      console.info(`⚡️[db]: ${dataSource.options.type} DB connected.`);
    })
    .catch(error => {
      console.error('Failed to connect to DB.', error);
      process.exit(1);
    });
};
