import { prisma } from '../data/prismaClient';

export const travelInterestsService = {
  async getAllTravelInterests() {
    return await prisma.travelInterests.findMany();
  },
};
