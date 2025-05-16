import { User } from '../models/user.model';
import { prisma, Prisma } from '../lib/prisma';

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany();
  },

  getUserById: async (id: number): Promise<User | null> => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  createUser: async (
  userData: Omit<User, 'id' | 'createdAt'>
): Promise<User> => {
  return await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: userData.password,
      profileBio: userData.profileBio,
      profileImage: userData.profileImage,
      travelPreferences: userData.travelPreferences // Aqui é o ID da preferência (um número)
        ? {
            connect: { id: userData.travelPreferences }, // Conecta a UM ÚNICO ID
          }
        : undefined, // Ou para desconectar se for null: { disconnect: true } se aplicável
    },
  });
},

  updateUser: async (
    id: number,
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

  deleteUser: async (id: number): Promise<boolean> => {
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

