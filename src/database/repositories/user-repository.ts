import { Service } from 'typedi';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { dataSource } from '../data-source';
import { User } from '../entities/User';
import { CreateUser } from '../../models/requests/create-user';
import { UpdateUser } from '~/models/requests/update-user';

@Service()
export class UserRepository {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = dataSource.getRepository(User);
  }

  async findAllUsers(): Promise<User[]> {
    return await this.userRepository.find({
      order: { name: 'DESC' }
    });
  }

  async findUserById(id: string): Promise<User> {
    return await this.userRepository.findOne({ where: { id } });
  }

  async createUser(user: CreateUser): Promise<CreateUser & User> {
    return await this.userRepository.save({
      ...user
    });
  }

  async updateUser(id: string, body: UpdateUser): Promise<UpdateResult> {
    return await this.userRepository.update({ id }, { ...body });
  }

  async deleteUserById(id: string): Promise<DeleteResult> {
    return await this.userRepository.delete({ id });
  }
}
