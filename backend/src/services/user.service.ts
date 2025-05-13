import { PrismaClient } from '@prisma/client';
import { User } from '../models/user.model';

const prisma = new PrismaClient();

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany() as User[];
  },

  getUserById: async (id: string): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { id },
    }) as User | null;
  },

  createUser: async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> => {
    const newUser = await prisma.user.create({
      data: {
        ...userData,
      },
    }) as User;
    return newUser;
  },

  updateUser: async (id: string, updateData: Partial<Omit<User, 'id'>>): Promise<User | null> => {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...updateData,
      },
    }) as User | null;
    return updatedUser;
  },
  

  deleteUser: async (id: string): Promise<boolean> => {
    try {
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  },
};
