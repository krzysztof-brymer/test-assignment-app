import { Service } from 'typedi';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../database/entities/User';
import { UserRepository } from '../database/repositories/user-repository';
import { CreateUser } from '../models/requests/create-user';
import { UpdateUser } from '../models/requests/update-user';

@Service()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.findAllUsers();
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findUserById(id);
  }

  async createUser(user: CreateUser): Promise<CreateUser & User> {
    return await this.userRepository.createUser(user);
  }

  async updateUser(id: string, body: UpdateUser): Promise<UpdateResult> {
    return await this.userRepository.updateUser(id, body);
  }

  async deleteUserById(id: string): Promise<DeleteResult> {
    return await this.userRepository.deleteUserById(id);
  }
}
