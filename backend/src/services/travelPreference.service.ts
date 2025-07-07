import { Prisma, TravelPreference } from '../generated/prisma';
import { prisma } from '../data/prismaClient';

export class TravelPreferenceService {
  async create(
    userId: number,
    data: Prisma.TravelPreferenceCreateInput
  ): Promise<TravelPreference> {
    return prisma.travelPreference.upsert({
      where: { userId },
      update: data,
      create: {
        ...data,
        user: {
          connect: { id: userId },
        },
      },
      include: {
        travelInterests: true,
      },
    });
  }

  async findByUserId(userId: number): Promise<TravelPreference | null> {
    return prisma.travelPreference.findFirst({
      where: { userId },
      include: { travelInterests: true },
    });
  }

  // Tem que fazer o update na tabela que faz a relação também 
  async update(
    userId: number,
    data: Prisma.TravelPreferenceUpdateInput
  ): Promise<TravelPreference | null> {
    return prisma.travelPreference.update({
      where: { userId },
      data,
    });
  }

  async delete(userId: number): Promise<TravelPreference | null> {
    return prisma.travelPreference.delete({
      where: { userId },
    });
  }
}
