import { User } from '@prisma/client';
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

  async getUserEmail(id: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    return user ? user.email : null;
  }

  async update(id: number, data: UpdateUserDTO): Promise<User | null> {
    const email = await this.getUserEmail(id);
    if (!email) {
      return null;
    }
    return prisma.user.update({
      where: { email: email },
      data,
    });
  }

  async delete(id: number): Promise<User | null> {
    try {
      return await prisma.user.delete({ where: { id } });
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      throw error;
    }
  }
}
