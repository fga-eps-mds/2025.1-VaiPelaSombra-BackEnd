import { CreateItineraryDTO, UpdateItineraryDTO } from '../dtos/itinerary.dto';
import { Itinerary } from '../generated/prisma';
import { prisma } from '../data/prismaClient';

export class ItineraryService {
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

  async update(id: number, data: UpdateItineraryDTO): Promise<Itinerary | null> {
    return prisma.itinerary.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Itinerary | null> {
    return prisma.itinerary.delete({ where: { id } });
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

  async findByUserItineraryId(userId: number, itineraryId: number): Promise<Itinerary[] | null> {
    return prisma.itinerary.findMany({
      where: {
        id: itineraryId,
        users: {
          some: {
            id: userId,
          },
        },
      },
    });
  }
}
