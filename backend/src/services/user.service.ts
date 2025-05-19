
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
        // Crie um registro TravelPreferences em branco associado a este usuário
        // conforme seu schema (User.travelPreferences é TravelPreferences?)
        travelPreferences: {
          create: {
            // Forneça valores padrão para campos OBRIGATÓRIOS em TravelPreferences
            // conforme seu schema (TravelerType e TravelFrequency não são opcionais)
            travelerType: TravelerType.AVENTUREIRO, // Exemplo de padrão
            travelFrequency: TravelFrequency.ANUAL,   // Exemplo de padrão
            averageBudget: 0,                         // Exemplo de padrão
            // 'prefer' será uma lista vazia inicialmente por padrão
          },
        },
      },
      include: {
        // Inclua as preferências recém-criadas (em branco)
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

    return createdUser as User;
  },

  updateUser: async (
    id: number,
    userData: Partial<UpdateUserWithPreferencesInput>
  ): Promise<User | null> => {
    // IMPORTANTE: Se a senha estiver sendo atualizada, ela deve ser hasheada antes deste ponto ou aqui.
    // Exemplo: if (userData.password) userData.password = await hashPasswordFunction(userData.password);

    const dataToUpdate: Prisma.UserUpdateInput = {
      name: userData.name,
      email: userData.email,
      ...(userData.password && { password: userData.password }),
      profileBio: userData.profileBio,
      profileImage: userData.profileImage,
    };

    // Verifique se a chave 'travelPreferencesData' foi explicitamente passada na entrada
    if (userData.hasOwnProperty('travelPreferencesData')) {
      const prefsData = userData.travelPreferencesData;

      if (prefsData === null) {
        // O usuário quer remover/deletar suas preferências
        dataToUpdate.travelPreferences = {
          // Como User.travelPreferences é opcional (TravelPreferences?),
          // podemos deletar o registro relacionado.
          delete: true,
        };
      } else if (prefsData) {
        // O usuário quer criar ou atualizar suas preferências
        dataToUpdate.travelPreferences = {
          upsert: {
            // 'upsert' é adequado para relações 1-para-1.
            // Ele cria se o registro relacionado não existe, atualiza se existe.
            create: {
              travelerType: prefsData.travelerType,
              travelFrequency: prefsData.travelFrequency,
              averageBudget: prefsData.averageBudget,
              prefer: prefsData.travelInterestsIds?.length
                ? {
                    create: prefsData.travelInterestsIds.map(
                      (interestId) => ({
                        travelInterests: { connect: { id: interestId } },
                      })
                    ),
                  }
                : undefined,
            },
            update: {
              travelerType: prefsData.travelerType,
              travelFrequency: prefsData.travelFrequency,
              averageBudget: prefsData.averageBudget,
              // Para 'prefer' (muitos-para-muitos através da tabela Prefer),
              // 'set' pode ser complexo. Um padrão comum é deletar os links existentes
              // e criar novos.
              prefer: {
                // Isto deletará todos os registros Prefer existentes para este TravelPreferences
                // e então criará novos baseados em travelInterestsIds.
                deleteMany: {}, // Limpe os links 'Prefer' antigos
                create: prefsData.travelInterestsIds?.length
                  ? prefsData.travelInterestsIds.map((interestId) => ({
                      travelInterests: { connect: { id: interestId } },
                    }))
                  : [], // Se não houver IDs, crie um conjunto vazio de links
              },
            },
          },
        };
      }
      // Se userData.travelPreferencesData for undefined (chave não está em userData), as preferências não são tocadas.
    }

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
    return updatedUser as User | null; // Cast se necessário
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
