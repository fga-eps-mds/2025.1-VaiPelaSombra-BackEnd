// backend/src/services/user.service.ts

import { User } from '../models/user.model'; // Interface/Modelo User da sua aplicação
import {
  PrismaClient,
  Prisma,
  TravelerType,
  TravelFrequency,
} from '../generated/prisma';

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
    // Asserção de tipo necessária se o seu modelo User não corresponder perfeitamente à estrutura do include.
    // Considere usar Prisma.UserGetPayload para tipagem precisa.
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
    }) as User[]; // Cast (conversão de tipo) se o seu modelo User for ligeiramente diferente mas compatível
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
    return createdUser as User; // Cast se necessário
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
      ...(userData.password && { password: userData.password }), // Inclua a senha apenas se fornecida
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