// backend/src/services/user.service.ts

import { User } from '../models/user.model'; // Interface/Modelo User da sua aplicação
import {
  PrismaClient,
  Prisma,
  TravelerType,
  TravelFrequency,
} from '../generated/prisma';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

// --- Definições de Tipo para Entradas do Serviço ---

export interface UserPreferencesDataInput {
  travelerType: TravelerType;
  travelFrequency: TravelFrequency;
  averageBudget: number;
  travelInterestsIds?: number[]; // IDs de registros TravelInterest existentes para conectar
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string; // IMPORTANTE: Garanta que isto seja "hasheado" antes de chamar o serviço
  profileBio?: string | null;
  profileImage?: string | null;
}

export interface UpdateUserWithPreferencesInput {
  name?: string;
  email?: string;
  password?: string; // IMPORTANTE: Garanta que isto seja "hasheado" se fornecido
  profileBio?: string | null;
  profileImage?: string | null;
  // Use 'travelPreferencesData' para evitar confusão com o nome da relação
  // null significa "remover/deletar preferências"
  travelPreferencesData?: UserPreferencesDataInput | null;
}

// --- Implementação do UserService ---

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    const users = await prisma.user.findMany({
      include: {
        travelPreferences: {
          include: {
            prefer: {
              include: {
                travelInterests: true,
              },
            },
          },
        },
      },
    });
    return users;
  },

  getUserById: async (id: number): Promise<User | null> => {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        travelPreferences: {
          include: {
            prefer: {
              include: {
                travelInterests: true,
              },
            },
          },
        },
      },
    });
    return user as User | null; // Cast se necessário
  },

  createUser: async (userData: CreateUserInput): Promise<User> => {
    // IMPORTANTE: O hashing da senha deve acontecer *antes* que esta função seja chamada,
    // ou ser adicionado aqui se este serviço for responsável por isso.
    // Exemplo: const hashedPassword = await hashPasswordFunction(userData.password);
    // Então use hashedPassword abaixo.

    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Armazene a senha (idealmente hasheada)
        profileBio: userData.profileBio,
        profileImage: userData.profileImage,
      },
    });
    return createdUser as User; // Cast se necessário
  },

  updateUser: async (
    id: number,
    userData: Partial<UpdateUserWithPreferencesInput>
  ): Promise<User | null> => {
    const dataToUpdate: Prisma.UserUpdateInput = {
      name: userData.name,
      email: userData.email,
      ...(userData.password && { password: userData.password }), // Inclua a senha apenas se fornecida
      profileBio: userData.profileBio,
      profileImage: userData.profileImage,
    };

    // Não inclui mais lógica para atualizar travelPreferences

    const updatedUser = await prisma.user.update({
      where: { id },
      data: dataToUpdate,
      include: {
        travelPreferences: {
          include: {
            prefer: {
              include: {
                travelInterests: true,
              },
            },
          },
        },
      },
    });

    return updatedUser as User | null;
  },

  deleteUser: async (id: number): Promise<boolean> => {
    try {
      // Nota: O Prisma por padrão restringe a deleção se registros relacionados existirem
      // a menos que `onDelete: Cascade` seja especificado no schema na relação.
      // Sua relação `TravelPreferences.user` não especifica `onDelete` explicitamente.
      // Se houver um registro `TravelPreferences` para este usuário, isso pode falhar
      // com um erro de restrição de chave estrangeira, a menos que você lide com isso (ex: delete as preferências primeiro).
      // Para simplificar, assumindo que a deleção em cascata é desejada ou tratada em outro lugar.
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025' // "Registro a ser deletado não existe."
      ) {
        return false;
      }
      // Registre outros erros para depuração
      console.error('Erro ao deletar usuário:', error);
      return false;
    }
  },
};