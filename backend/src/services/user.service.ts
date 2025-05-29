import { Prisma, User } from '../generated/prisma';
import { IUserRepository } from '../repositories/user/user.repository';

export class UserService {
  constructor(private userRepository: IUserRepository) {}
  async create(data: Omit<Prisma.UserCreateInput, 'id'>): Promise<User> {
    return this.userRepository.create(data);
  }
  async findById(id: number): Promise<User | null> {
    return this.userRepository.findById(id);
  }
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }
  async update(id: number, data: Prisma.UserUpdateInput): Promise<User | null> {
    return this.userRepository.update(id, data);
  }
  async delete(id: number): Promise<User | null> {
    return this.userRepository.delete(id);
  }
}
