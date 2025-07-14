import { CreateItineraryDTO, UpdateItineraryDTO } from '../dtos/itinerary.dto';
import { Itinerary } from '../generated/prisma'; // ✅ Usar o mesmo caminho do seed
// OU se não funcionar:
// type Itinerary = Awaited<ReturnType<typeof prisma.itinerary.findFirst>>;
import { prisma } from '../data/prismaClient';
import { BadRequestError, NotFoundError } from '../errors/httpError';
import { Decimal } from '@prisma/client/runtime/library';

export class ItineraryService {
  async create(userId: number, data: CreateItineraryDTO): Promise<Itinerary> {
    const usersIds = data.usersIds ? Array.from(new Set([userId, ...data.usersIds])) : [userId];

    const prismaData = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      itineraryStatus: data.itineraryStatus,
      foodBudget: data.foodBudget ? new Decimal(data.foodBudget) : undefined,
      lodgingBudget: data.lodgingBudget ? new Decimal(data.lodgingBudget) : undefined,
      totalBudget: data.totalBudget ? new Decimal(data.totalBudget) : undefined,
      ownerId: userId,
      users: {
        connect: usersIds.map((id) => ({ id })),
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

    return prisma.itinerary.create({ data: prismaData });
  }

  async update(
    itineraryId: number,
    userId: number,
    data: UpdateItineraryDTO
  ): Promise<Itinerary | null> {
    const ownerId = await this.getOwnerId(itineraryId);
    if (userId !== ownerId) throw new BadRequestError('Only the owner can update the itinerary');

    const usersIds = data.usersIds ? Array.from(new Set([userId, ...data.usersIds])) : [userId];
    const prismaData = {
      title: data.title,
      startDate: data.startDate,
      endDate: data.endDate,
      itineraryStatus: data.itineraryStatus,
      foodBudget: data.foodBudget ? new Decimal(data.foodBudget) : undefined,
      lodgingBudget: data.lodgingBudget ? new Decimal(data.lodgingBudget) : undefined,
      totalBudget: data.totalBudget ? new Decimal(data.totalBudget) : undefined,
      users: {
        connect: usersIds.map((id) => ({ id })),
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

    return prisma.itinerary.update({
      where: { id: itineraryId },
      data: prismaData,
    });
  }

  async delete(itineraryId: number, userId: number): Promise<Itinerary | null> {
    const ownerId = await this.getOwnerId(itineraryId);
    if (userId !== ownerId) throw new BadRequestError('Only the owner can delete the itinerary');
    return prisma.itinerary.delete({ where: { id: itineraryId } });
  }

  async findByUserItineraryId(userId: number, itineraryId: number): Promise<Itinerary | null> {
    return prisma.itinerary.findFirst({
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

  async getOwnerId(itineraryId: number): Promise<number> {
    const itinerary = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      select: { ownerId: true },
    });

    if (!itinerary) throw new NotFoundError('Itinerary not found');
    return itinerary.ownerId;
  }

  async addUserToItinerary(itineraryId: number, userId: number): Promise<Itinerary | null> {
    return prisma.itinerary.update({
      where: { id: itineraryId },
      data: {
        users: {
          connect: { id: userId },
        },
      },
    });
  }

  async findByUserId(userId: number): Promise<Itinerary[]> {
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
}
