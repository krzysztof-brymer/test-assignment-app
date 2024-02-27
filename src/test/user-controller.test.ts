import { Repository } from 'typeorm';
import request from 'supertest';
import { User } from '../database/entities/User';
import { dataSource } from '../database/data-source';
import { CreateUser } from '~/models/requests/create-user';
import { serverConfig } from '../configs/server-config';
import { testServer } from './config.test';
import { isUUID } from 'validator';
import crypto from 'crypto';
import { UpdateUser } from '~/models/requests/update-user';

type TestCase = [{ name?: string; email?: string }, string];

describe('UserController', () => {
  const basicAuth = serverConfig.basicAuth;

  const testCases: TestCase[] = [
    [{ name: '', email: 'chris@test.com' }, 'missing or empty name'],
    [{ name: 'Chris', email: '' }, 'missing or empty email'],
    [{ name: 'Chris', email: 'invalid-email' }, 'invalid email format'],
    [{}, 'missing both name and email']
  ];

  let userRepository: Repository<User>;

  beforeAll(() => {
    userRepository = dataSource.getRepository(User);
  });

  describe('Authorization tests', () => {
    const endpoints = [
      { path: '/users', method: 'get' },
      { path: '/users/uuid', method: 'get' },
      { path: '/users', method: 'post' },
      { path: '/users', method: 'put' },
      { path: '/users/uuid', method: 'delete' }
    ];

    test.each(endpoints)(
      'should require authorization on %s with no credentials',
      async ({ path, method }) => {
        const response = await request(testServer)[method](path);
        expect(response.status).toBe(401);
      }
    );

    test.each(endpoints)(
      'should reject access to %s with invalid credentials',
      async ({ path, method }) => {
        const response = await request(testServer)
          [method](path)
          .auth('invalid-username', 'invalid-password');
        expect(response.status).toBe(401);
      }
    );
  });

  describe('GET /users', () => {
    it('should return 10 existing users', async () => {
      const users: User[] = [];
      const count = 10;

      for await (const [i] of Array.from({ length: count }).entries()) {
        const name = `User ${i + 1}`;
        const email = `user${i + 1}@example.com`;

        const user = await userRepository.save({
          name: name,
          email: email
        });

        users.push(user);
      }

      const response = await request(testServer)
        .get('/users')
        .auth(basicAuth.username, basicAuth.password);

      expect(response.statusCode).toEqual(200);
      expect(users.length).toEqual(count);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toEqual(count);
    });
  });

  describe('GET /users/:id', () => {
    it('should return single user', async () => {
      const user = {
        name: 'John',
        email: 'john@gmail.com'
      };

      const userFromDB = await userRepository.save(user);

      const response = await request(testServer)
        .get(`/users/${userFromDB.id}`)
        .auth(basicAuth.username, basicAuth.password);

      expect(response.statusCode).toEqual(200);
      expect(response.body.id).toEqual(userFromDB.id);
      expect(response.body.name).toEqual(user.name);
      expect(response.body.email).toEqual(user.email);
    });

    it('should return 204 if user does not exist', async () => {
      const response = await request(testServer)
        .get(`/users/${crypto.randomUUID()}`)
        .auth(basicAuth.username, basicAuth.password);

      expect(response.statusCode).toEqual(204);
    });

    it('should return 400 if id is not a valid UUID', async () => {
      const response = await request(testServer)
        .get('/users/invalid-uuid')
        .auth(basicAuth.username, basicAuth.password);

      expect(response.statusCode).toEqual(400);
      expect(response.body.message).toEqual(
        'Invalid UUID format for parameter ID.'
      );
    });
  });

  describe('POST /users', () => {
    it('should create new user', async () => {
      const createUserRequest: CreateUser = {
        name: 'Chris',
        email: 'chris@test.com'
      };

      const response = await request(testServer)
        .post('/users')
        .send(createUserRequest)
        .auth(basicAuth.username, basicAuth.password);

      const body = response.body;

      const newUser = await userRepository.findOne({
        where: { name: createUserRequest.name, email: createUserRequest.email }
      });

      expect(newUser).toBeDefined();
      expect(response.statusCode).toEqual(201);
      expect(body.message).toEqual('User successfully created.');
      expect(isUUID(body.user.id)).toBe(true);
      expect(body.user.name).toEqual(createUserRequest.name);
      expect(body.user.email).toEqual(createUserRequest.email);
    });

    test.each(testCases)(
      'should fail to create a new user with %s',
      async createUserRequest => {
        const response = await request(testServer)
          .post('/users')
          .send(createUserRequest)
          .auth(basicAuth.username, basicAuth.password);

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('errors');
      }
    );
  });

  describe('PUT /users/:id', () => {
    it('should update user', async () => {
      const user = {
        name: 'John',
        email: 'john@test.com'
      };

      const userFromDB = await userRepository.save(user);

      const updatedUser: UpdateUser = {
        name: 'John Doe',
        email: 'john_doe@gmail.com'
      };

      const response = await request(testServer)
        .put(`/users/${userFromDB.id}`)
        .send(updatedUser)
        .auth(basicAuth.username, basicAuth.password);

      const body = response.body;

      const userAfterUpdate = await userRepository.findOne({
        where: { id: userFromDB.id }
      });

      expect(response.statusCode).toEqual(200);
      expect(body.message).toEqual('User successfully updated.');
      expect(userAfterUpdate.id).toEqual(userFromDB.id);
      expect(userAfterUpdate.name).toEqual(updatedUser.name);
      expect(userAfterUpdate.email).toEqual(updatedUser.email);
    });

    it('should return 404 if user does not exist', async () => {
      const updatedUser: UpdateUser = {
        name: 'John Doe',
        email: 'email@email.com'
      };

      const response = await request(testServer)
        .put(`/users/${crypto.randomUUID()}`)
        .send(updatedUser)
        .auth(basicAuth.username, basicAuth.password);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual(
        "User with given ID doesn't exist."
      );
    });

    test.each(testCases)(
      'should fail to update user with %s',
      async updateUserRequest => {
        const user = {
          name: 'John',
          email: 'john@test.com'
        };

        const userFromDB = await userRepository.save(user);

        const response = await request(testServer)
          .put(`/users/${userFromDB.id}`)
          .send(updateUserRequest)
          .auth(basicAuth.username, basicAuth.password);

        expect(response.statusCode).toEqual(400);
        expect(response.body).toHaveProperty('errors');
      }
    );
  });

  describe('DELETE /users/:id', () => {
    it('should delete user', async () => {
      const user = {
        name: 'John',
        email: 'email@email.com'
      };

      const userFromDB = await userRepository.save(user);

      const response = await request(testServer)
        .delete(`/users/${userFromDB.id}`)
        .auth(basicAuth.username, basicAuth.password);

      const userAfterDelete = await userRepository.findOne({
        where: { id: userFromDB.id }
      });

      expect(response.statusCode).toEqual(204);
      expect(userAfterDelete).toBeNull();
    });

    it('should return 404 if user does not exist', async () => {
      const response = await request(testServer)
        .delete(`/users/${crypto.randomUUID()}`)
        .auth(basicAuth.username, basicAuth.password);

      expect(response.statusCode).toEqual(404);
      expect(response.body.message).toEqual(
        "User with given ID doesn't exist."
      );
    });
  });
});
