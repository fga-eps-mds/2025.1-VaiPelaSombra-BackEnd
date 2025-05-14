import { User } from '../models/user.model';
import fs from 'fs';
import path from 'path';
import { prisma } from '../data/prismaClient';
import { TravelPreferences } from '../generated/prisma';

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
  getAllUsers: (): User[] => {
    return readUsers();
  },

  getUserById: (id: string): User | undefined => {
    const users = readUsers();
    return users.find((user) => user.id === id);
  },

  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User => {
    const users = readUsers();
    const newUser: User = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    users.push(newUser);
    writeUsers(users);
    return newUser;
  },

  updateUser: (id: string, updateData: Partial<Omit<User, 'id'>>): User | undefined => {
    const users = readUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1) return undefined;

    const updatedUser = {
      ...users[userIndex],
      ...updateData,
      updatedAt: new Date(),
    };

    users[userIndex] = updatedUser;
    writeUsers(users);
    return updatedUser;
  },

  deleteUser: (id: string): boolean => {
    const users = readUsers();
    const initialLength = users.length;
    const filteredUsers = users.filter((user) => user.id !== id);

    if (filteredUsers.length === initialLength) return false;

    writeUsers(filteredUsers);
    return true;
  },

  async getUserTravelPreferencesByUserId(id: number) {
    const userPreferences = await prisma.travelPreferences.findFirst({
      where: {
        userId: id,
      },
    });
    return userPreferences;
  },

  async saveUserTravelPreferences(id: number, travelPreferences: TravelPreferences) {
    const { averageBudget, travelerType, travelFrequency } = travelPreferences;

    const savedUserPreferences = await prisma.travelPreferences.upsert({
      where: {
        userId: id,
      },
      update: {
        averageBudget,
        travelerType,
        travelFrequency,
      },
      create: {
        userId: id,
        averageBudget,
        travelerType,
        travelFrequency,
      },
    });

    console.log(savedUserPreferences);

    return savedUserPreferences;
  },

  async getUserTravelInterestsByUserId(id: number) {
    const userPreferences = await prisma.travelPreferences.findFirst({
      where: { userId: id },
      include: {
        prefer: {
          include: {
            travelInterests: true,
          },
        },
      },
    });

    const userInterests = userPreferences?.prefer.map((p) => p.travelInterests);
    return userInterests;
  },

  async saveUserTravelInterests(id: number, travelInterestsIds: number[]) {
    const userPreferences = await prisma.travelPreferences.findFirst({
      where: { userId: id },
    });
    const userTravelInterests = travelInterestsIds.map((id) => ({
      travelInterestsId: id,
      travelPreferencesId: userPreferences?.id,
    }));

    await prisma.prefer.deleteMany({
      where: { travelPreferencesId: userPreferences?.id },
    });

    const savedInterests = await prisma.prefer.createMany({
      data: userTravelInterests,
    });
    return savedInterests;
  },
};
