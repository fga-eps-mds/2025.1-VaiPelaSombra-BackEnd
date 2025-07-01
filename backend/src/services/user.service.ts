import { User } from '../generated/prisma';
import { prisma } from '../data/prismaClient';
import { CreateUserDTO, UpdateUserDTO } from '../dtos/user.dto';
import { UserPreferencesDataInput, UpdateUserWithPreferencesInput, CreateUserInput } from '../dtos/preferences.dto';
import { Prisma } from '@prisma/client';



export class UserService {
  async createUser(userData: CreateUserInput): Promise<User> {
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
  }

  async updateUser(
    id: number,
    userData: Partial<UpdateUserWithPreferencesInput>
  ): Promise<User | null> {
    const dataToUpdate: Prisma.UserUpdateInput = {
      name: userData.name,
      email: userData.email,
      ...(userData.password && { password: userData.password }),
      profileBio: userData.profileBio,
      profileImage: userData.profileImage,
    };

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
  }

  async deleteUser(id: number): Promise<boolean> {
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
  }

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async findAll(): Promise<User[]> {
    return prisma.user.findMany();
  }

  async getUserEmail(id: number): Promise<string | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { email: true },
    });
    return user ? user.email : null;
  }

  async updateTravelPreferences(
    userId: number,
    travelPreferencesData: UserPreferencesDataInput
  ): Promise<void> {
    const existingPref = await prisma.travelPreferences.findUnique({
      where: { userId },
    });

    if (existingPref) {
      await prisma.travelPreferences.update({
        where: { userId },
        data: {
          travelerType: travelPreferencesData.travelerType,
          travelFrequency: travelPreferencesData.travelFrequency,
          averageBudget: travelPreferencesData.averageBudget,
        },
      });
    } else {
      await prisma.travelPreferences.create({
        data: {
          userId,
          travelerType: travelPreferencesData.travelerType,
          travelFrequency: travelPreferencesData.travelFrequency,
          averageBudget: travelPreferencesData.averageBudget,
        },
      });
    }
  }
}