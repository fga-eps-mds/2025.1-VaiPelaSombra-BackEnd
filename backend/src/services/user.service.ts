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
  // Use 'travelPreferencesData' para evitar confusão com o nome da relação
  // null significa "remover/deletar preferências"
  travelPreferencesData?: UserPreferencesDataInput | null;
}

// --- Implementação do UserService ---

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
    userData: Partial<Omit<User, 'id' | 'createdAt'>>
  ): Promise<User | null> => {
    return await prisma.user.update({
      where: { id },
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        profileBio: userData.profileBio,
        profileImage: userData.profileImage,
        travelPreferences: userData.travelPreferences
          ? {
              connect: { id: userData.travelPreferences },
            }
          : undefined,
      },
    });
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

