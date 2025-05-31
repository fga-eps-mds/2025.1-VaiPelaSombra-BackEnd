import { Prisma, Itinerary } from '../../generated/prisma';
import { prisma } from '../../data/prismaClient';
import { IItineraryRepository } from './itinerary.reposity';
import { CreateItineraryDTO } from '../../dtos/itinerary.dto';

export class PrismaItineraryRepository implements IItineraryRepository {
  async create(userId: number, data: CreateItineraryDTO): Promise<Itinerary> {
    const userIds = data.userIds ? Array.from(new Set([userId, ...data.userIds])) : [userId];
    const prismaData = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      itineraryStatus: data.itineraryStatus,
      foodBudget: data.foodBudget,
      lodgingBudget: data.lodgingBudget,
      totalBudget: data.totalBudget,
      users: {
        connect: userIds.map((id) => ({ id })),
      },
      transports: {
        connect: data.transportIds?.map((id) => ({ id })) || [],
      },
      activities: {
        connect: data.activityIds?.map((id) => ({ id })) || [],
      },
      destinations: {
        connect: data.destinationIds?.map((id) => ({ id })) || [],
      },
      requiredDocuments: {
        connect: data.requiredDocumentIds?.map((id) => ({ id })) || [],
      },
    };
    return prisma.itinerary.create({
      data: {
        ...prismaData,
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
