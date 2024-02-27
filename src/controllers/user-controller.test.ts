import { User } from '../database/entities/User';
import { serverConfigTest } from '../configs/server-config';
import { Repository } from 'typeorm';
import { dataSource } from '../database/data-source';
// import { CreateUser } from '~/models/requests/create-user';
import request from 'supertest';
import { testServer } from '../test/config.test';

describe('UserController', () => {
  const basicAuth = serverConfigTest.basicAuth;

  let userRepository: Repository<User>;
  //   let newUser: User;

  //   const name = 'Johnny English';

  beforeAll(() => {
    userRepository = dataSource.getRepository(User);
  });

  //   beforeEach(async () => {
  //     newUser = await userRepository.save({ name });
  //     console.log(newUser);
  //   });

  //   describe('POST /user', () => {
  //     it('should create new user', async () => {
  //       await userRepository.clear();

  //       const response = await request(testServer)
  //         .post('/user')
  //         .send({
  //           name: name,
  //           email: 'sw@wp.pl'
  //         })
  //         .auth(basicAuth.username, basicAuth.password);

  //       expect(response.statusCode).toEqual(200);
  //       expect(response.body?.message).toEqual('Customer successfully created.');
  //       expect(response.body?.name).toEqual(name);
  //     });
  //   });

  describe('GET /users', () => {
    it('should return all existing customers', async () => {
      await userRepository.clear();

      const response = await request(testServer)
        .get('/users')
        .auth(basicAuth.username, basicAuth.password);

      console.log(response.body);
      expect(response.statusCode).toEqual(200);
    });
  });
});
