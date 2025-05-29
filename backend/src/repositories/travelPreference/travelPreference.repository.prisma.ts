import { Prisma, TravelPreference } from '../../generated/prisma';
import { prisma } from '../../data/prismaClient';
import { ITravelPreferenceRepository } from '../travelPreference/travelPreference.repository';

export class PrismaTravelPreferenceRepository implements ITravelPreferenceRepository {
  async create(
    userId: number,
    data: Prisma.TravelPreferenceCreateInput
  ): Promise<TravelPreference> {
    return prisma.travelPreference.create({
      data: {
        ...data,
        user: { connect: { id: userId } },
      },
    });
  }

  async findByUserId(userId: number): Promise<TravelPreference | null> {
    return prisma.travelPreference.findUnique({
      where: { userId },
      include: { travelInterests: true },
    });
  }

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
