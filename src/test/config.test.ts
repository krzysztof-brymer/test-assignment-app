import { Repository } from 'typeorm';
import { serverConfig } from '../configs/server-config';
import { dataSource, initializeDb } from '../database/data-source';
import { User } from '../database/entities/User';
import server from '../server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let testServer: any;

let userRepository: Repository<User>;

beforeAll(async () => {
  userRepository = dataSource.getRepository(User);

  await initializeDb({ dataSource });

  testServer = server.listen(serverConfig.port, () => {});
});

afterEach(async () => {
  if (dataSource.isInitialized) {
    await userRepository.clear().catch(error => console.error(error));
  }
});

afterAll(async () => {
  await dataSource.dropDatabase().catch(error => console.error(error));

  await dataSource.destroy().catch(error => console.error(error));
});
