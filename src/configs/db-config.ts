import dotenv from 'dotenv';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

dotenv.config();

const isTestEnvironment =
  process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test';

console.log(isTestEnvironment);
console.log(process.env.NODE_ENV);

export const dbConfig: PostgresConnectionOptions = isTestEnvironment
  ? {
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST_TEST ?? 'localhost',
      port: Number(process.env.POSTGRES_DB_PORT_TEST) ?? 5430,
      username: process.env.POSTGRES_DB_USERNAME_TEST ?? 'postgres',
      password: process.env.POSTGRES_DB_PASSWORD_TEST ?? 'default_password',
      database: process.env.POSTGRES_DB_NAME_TEST ?? 'postgres_test',
      useUTC: true,
      synchronize:
        Boolean(process.env.POSTGRES_DB_SYNCHRONIZATION_TEST) ?? true,
      logging: false,
      logger: 'advanced-console',
      migrationsRun:
        Boolean(process.env.POSTGRES_DB_AUTO_MIGRATIONS_TEST) ?? true
    }
  : {
      type: 'postgres',
      host: process.env.POSTGRES_DB_HOST ?? 'localhost',
      port: Number(process.env.POSTGRES_DB_PORT) ?? 5432,
      username: process.env.POSTGRES_DB_USERNAME ?? 'postgres',
      password: process.env.POSTGRES_DB_PASSWORD ?? 'default_password',
      database: process.env.POSTGRES_DB_NAME ?? 'postgres',
      useUTC: true,
      synchronize: Boolean(process.env.POSTGRES_DB_SYNCHRONIZATION) ?? true,
      logging: false,
      logger: 'advanced-console',
      migrationsRun: Boolean(process.env.POSTGRES_DB_AUTO_MIGRATIONS) ?? true
    };
