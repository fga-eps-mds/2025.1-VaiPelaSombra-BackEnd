import { Prisma, User } from '../../generated/prisma';
import { IUserRepository } from './user.repository';
import { prisma } from '../../data/prismaClient';
export class PrismaUserRepository implements IUserRepository {
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data });
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async update(id: number, data: Prisma.UserUpdateInput): Promise<User | null> {
    return prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<User | null> {
    return prisma.user.delete({ where: { id } });
  }
}
