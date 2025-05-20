import { prisma } from '../data/prismaClient';
import { TravelPreferences } from '../generated/prisma';

export const UserPreferencesService = {
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

    return savedUserPreferences;
  },
};
