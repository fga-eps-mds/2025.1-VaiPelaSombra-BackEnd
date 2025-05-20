import { User } from '../models/user.model'; // Interface/Modelo User da sua aplicação
import { PrismaClient, Prisma, TravelerType, TravelFrequency } from '../generated/prisma';

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
  travelPreferencesData?: UserPreferencesDataInput | null;
}

// --- Implementação do UserService ---

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    return await prisma.user.findMany({
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
    }) as User[];
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
    return user as User | null;
  },

  createUser: async (userData: CreateUserInput): Promise<User> => {
    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Certifique-se de hashear a senha antes
        profileBio: userData.profileBio,
        profileImage: userData.profileImage,
      },
    });

    return createdUser as User;
  },

  updateUser: async (
    id: number,
    userData: Partial<UpdateUserWithPreferencesInput>
  ): Promise<User | null> => {
    const dataToUpdate: Prisma.UserUpdateInput = {
      name: userData.name,
      email: userData.email,
      ...(userData.password && { password: userData.password }),
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
      await prisma.user.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2025'
      ) {
        return false;
      }
      console.error('Erro ao deletar usuário:', error);
      return false;
    }
  },
};
