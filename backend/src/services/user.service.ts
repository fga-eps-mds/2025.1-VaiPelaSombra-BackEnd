import { User } from '../models/user.model';
import fs from 'fs';
import path from 'path';
import { prisma, Prisma } from '../lib/prisma';


// TO DO: alterar a logica deste arquivo para em vez de utilizar o fs, utilizar um banco de dados no postgreSQL com prisma
// 
const dataPath = path.join(__dirname, '../../src/data/users.json');

// Helper function to read users
const readUsers = (): User[] => {
  try {
    const data = fs.readFileSync(dataPath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return error;
  }
};

// Helper function to write users
const writeUsers = (users: User[]) => {
  fs.writeFileSync(dataPath, JSON.stringify(users, null, 2), 'utf-8');
};

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
