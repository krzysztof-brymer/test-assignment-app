import dotenv from 'dotenv';

dotenv.config();

export interface ServerConfig {
  port: number;
  host: string;
  basicAuth: {
    username: string;
    password: string;
  };
}

export const serverConfig: ServerConfig = {
  port:
    process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test'
      ? Number(process.env.PORT_TEST) ?? 8887
      : Number(process.env.PORT) ?? 8888,
  host: process.env.HOST ?? 'localhost',
  basicAuth: {
    username: process.env.BASIC_AUTH_USERNAME ?? 'test',
    password: process.env.BASIC_AUTH_PASSWORD ?? 'testpw'
  }
};
