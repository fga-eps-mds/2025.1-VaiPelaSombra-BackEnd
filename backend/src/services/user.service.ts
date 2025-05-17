<<<<<<< HEAD
import { User } from '../models/user.model'; // Interface/Modelo User da sua aplicação
import { PrismaClient, Prisma, TravelerType, TravelFrequency } from '../generated/prisma';

const prisma = new PrismaClient();

// --- Definições de Tipo para Entradas do Serviço ---

=======
// backend/src/services/user.service.ts

import { User } from '../models/user.model'; // Your application's User model/interface
import {
  PrismaClient,
  Prisma, // General Prisma types
  TravelerType, // Enum from your schema
  TravelFrequency, // Enum from your schema
} from '../generated/prisma'; // Corrected path to your generated Prisma Client

const prisma = new PrismaClient();

// --- Type Definitions for Service Inputs ---

// Data for creating/updating the TravelPreferences record itself
>>>>>>> 1daef3e (#12 Cadastro de Usuario)
export interface UserPreferencesDataInput {
  travelerType: TravelerType;
  travelFrequency: TravelFrequency;
  averageBudget: number;
<<<<<<< HEAD
  travelInterestsIds?: number[]; // IDs de registros TravelInterest existentes para conectar
}

export interface CreateUserInput {
  name: string;
  email: string;
  password: string; // IMPORTANTE: Garanta que isto seja "hasheado" antes de chamar o serviço
=======
  travelInterestsIds?: number[]; // IDs of existing TravelInterest records to connect
}

// Input for creating a new user (no preferences data needed at creation, will be blank)
export interface CreateUserInput {
  name: string;
  email: string;
  password: string; // IMPORTANT: Ensure this is hashed before calling the service
>>>>>>> 1daef3e (#12 Cadastro de Usuario)
  profileBio?: string | null;
  profileImage?: string | null;
}

<<<<<<< HEAD
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
=======
// Input for updating a user, including their preferences
export interface UpdateUserWithPreferencesInput {
  name?: string;
  email?: string;
  password?: string; // IMPORTANT: Ensure this is hashed if provided
  profileBio?: string | null;
  profileImage?: string | null;
  // Use 'travelPreferencesData' to avoid confusion with the relation name
  // null means "remove/delete preferences"
  travelPreferencesData?: UserPreferencesDataInput | null;
}

// --- UserService Implementation ---
>>>>>>> 1daef3e (#12 Cadastro de Usuario)

export const UserService = {
  getAllUsers: async (): Promise<User[]> => {
    // Type assertion needed if your User model doesn't perfectly match the include structure.
    // Consider using Prisma.UserGetPayload for precise typing.
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
    }) as User[]; // Cast if your User model is slightly different but compatible
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
    return user as User | null; // Cast if needed
  },

  createUser: async (userData: CreateUserInput): Promise<User> => {
    // IMPORTANT: Password hashing should happen *before* this function is called,
    // or be added here if this service is responsible for it.
    // Example: const hashedPassword = await hashPasswordFunction(userData.password);
    // Then use hashedPassword below.

    const createdUser = await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password, // Store the (ideally hashed) password
        profileBio: userData.profileBio,
        profileImage: userData.profileImage,
        // Create a blank TravelPreferences record associated with this user
        // as per your schema (User.travelPreferences is TravelPreferences?)
        travelPreferences: {
          create: {
            // Provide default values for REQUIRED fields in TravelPreferences
            // as per your schema (TravelerType and TravelFrequency are not optional)
            travelerType: TravelerType.AVENTUREIRO, // Example default
            travelFrequency: TravelFrequency.ANUAL, // Example default
            averageBudget: 0, // Example default
            // 'prefer' will be an empty list initially by default
          },
        },
      },
      include: {
        // Include the newly created (blank) preferences
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
    return createdUser as User; // Cast if needed
  },

  updateUser: async (
    id: number,
    userData: Partial<UpdateUserWithPreferencesInput>
  ): Promise<User | null> => {
    // IMPORTANT: If password is being updated, it should be hashed before this point or here.
    // Example: if (userData.password) userData.password = await hashPasswordFunction(userData.password);

    const dataToUpdate: Prisma.UserUpdateInput = {
      name: userData.name,
      email: userData.email,
      ...(userData.password && { password: userData.password }), // Only include password if it's provided
      profileBio: userData.profileBio,
      profileImage: userData.profileImage,
    };

    // Check if 'travelPreferencesData' key is explicitly passed in the input
    if (userData.hasOwnProperty('travelPreferencesData')) {
      const prefsData = userData.travelPreferencesData;

      if (prefsData === null) {
        // User wants to remove/delete their preferences
        dataToUpdate.travelPreferences = {
          // Since User.travelPreferences is optional (TravelPreferences?),
          // we can delete the related record.
          delete: true,
        };
      } else if (prefsData) {
        // User wants to create or update their preferences
        dataToUpdate.travelPreferences = {
          upsert: {
            // 'upsert' is suitable for 1-to-1 relations.
            // It creates if the related record doesn't exist, updates if it does.
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
              // For 'prefer' (many-to-many through Prefer table),
              // 'set' can be complex. A common pattern is to delete existing links
              // and create new ones.
              prefer: {
                // This will delete all existing Prefer records for this TravelPreferences
                // and then create new ones based on travelInterestsIds.
                deleteMany: {}, // Clear old 'Prefer' links
                create: prefsData.travelInterestsIds?.length
                  ? prefsData.travelInterestsIds.map((interestId) => ({
                      travelInterests: { connect: { id: interestId } },
                    }))
                  : [], // If no IDs, create an empty set of links
              },
            },
          },
        };
      }
      // If userData.travelPreferencesData is undefined (key not in userData), preferences are not touched.
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
    return updatedUser as User | null; // Cast if needed
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
        error.code === 'P2025' // "Record to delete does not exist."
      ) {
        return false;
      }
      // Log other errors for debugging
      console.error('Error deleting user:', error);
      return false;
    }
  },
};