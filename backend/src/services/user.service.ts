import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany();
  },

  getUserById: async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  createUser: async (
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<User> => {
    return await prisma.user.create({
      data: {
        ...userData,
      },
    });
  },

  updateUser: async (
    id: string,
    updateData: Partial<Omit<User, 'id'>>
  ): Promise<User | null> => {
    try {
      return await prisma.user.update({
        where: { id },
        data: {
          ...updateData,
          updatedAt: new Date(),
        },
      });
    } catch (error) {
      return null; // Caso nao exista
    }
  },

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false; // Caso nao exista
    }
  },
};
