import { User } from '../generated/prisma';
// import { IUserRepository } from './user.repository';
import { prisma } from '../data/prismaClient';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';

export class UserService {
  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User | null> {
    return prisma.user.delete({ where: { id } });
  }
}
