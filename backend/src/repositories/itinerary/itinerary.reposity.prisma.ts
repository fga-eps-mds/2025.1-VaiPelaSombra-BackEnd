import { Prisma, Itinerary } from '../../generated/prisma';
import { prisma } from '../../data/prismaClient';
import { IItineraryRepository } from './itinerary.reposity';

export class PrismaItineraryRepository implements IItineraryRepository {
  async create(data: Prisma.ItineraryCreateInput): Promise<Itinerary> {
    return prisma.itinerary.create({
      data: {
        ...data,
      },
    });
  }

  async findByUserId(userId: number): Promise<Itinerary[] | null> {
    return prisma.itinerary.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }

  async update(id: number, data: Prisma.ItineraryUpdateInput): Promise<Itinerary | null> {
    return prisma.itinerary.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Itinerary | null> {
    return prisma.itinerary.delete({ where: { id } });
  }
}
