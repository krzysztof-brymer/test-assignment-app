import { Repository } from 'typeorm';
import { serverConfigTest } from '../configs/server-config';
import { dataSource, initializeDb } from '../database/data-source';
import { User } from '../database/entities/User';
import app from '../server';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export let testServer: any;

let userRepository: Repository<User>;

beforeAll(async () => {
  userRepository = dataSource.getRepository(User);

  await initializeDb({ dataSource });
  console.log('gere');

  testServer = app.listen(serverConfigTest.port, () => {
    console.info(
      `⚡️[test-server]: server is running at http://${serverConfigTest.host}:${serverConfigTest.port}`
    );
  });
});

afterEach(async () => {
  if (dataSource.isInitialized) {
    await userRepository
      .clear()
      .then(() => {
        console.info(`⚡️[test-db]: Postgres DB cleared.`);
      })
      .catch(error => console.error(error));
  }
});

afterAll(async () => {
  // await testServer.close(() => {
  //   console.info(
  //     `⚡️[test-server]: express server http://${serverConfigTest.host}:${serverConfigTest.port} is closed.`
  //   );
  // });

  await dataSource
    .dropDatabase()
    .then(() => {
      console.info(`⚡️[test-db]: Postgres DB dropped.`);
    })
    .catch(error => console.error(error));

  await dataSource
    .destroy()
    .then(() => {
      console.info(`⚡️[test-db]: Postgres} DB disconnected.`);
    })
    .catch(error => console.error(error));
});
