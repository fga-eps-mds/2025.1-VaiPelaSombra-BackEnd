import { prisma } from '../data/prismaClient';

export const TravelInterestsService = {
  async getAllTravelInterests() {
    return await prisma.travelInterests.findMany();
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
