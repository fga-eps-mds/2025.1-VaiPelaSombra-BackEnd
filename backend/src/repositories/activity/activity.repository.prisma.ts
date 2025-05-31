import { prisma } from '../../data/prismaClient';
import { CreateActivityDTO, UpdateActivityDTO } from '../../dtos/activity.dto';
import { Activity, Prisma } from '../../generated/prisma';
import { IActivityRepository } from './activity.repository';
export class PrismaActivityRepository implements IActivityRepository {
  async create(data: CreateActivityDTO): Promise<Activity> {
    const { itineraryId, ...rest } = data;
    const prismaData: Prisma.ActivityCreateInput = {
      ...rest,
      itinerary: { connect: { id: itineraryId } },
    };
    return prisma.activity.create({ data: prismaData });
  }

  async delete(id: number): Promise<Activity | null> {
    return prisma.activity.delete({
      where: { id },
    });
  }
  async update(id: number, data: UpdateActivityDTO): Promise<Activity | null> {
    return prisma.activity.update({
      where: { id },
      data,
    });
  }
  async findAllOrderedByDate(itineraryId: number): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: { itineraryId },
      orderBy: { startTime: 'asc' },
    });
  }

  async findConflictingActivities(
    itineraryId: number,
    startTime: Date,
    endTime: Date
  ): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        itineraryId,
        AND: [
          {
            startTime: {
              lte: endTime,
            },
          },
          {
            endTime: {
              gte: startTime,
            },
          },
        ],
      },
    });
  }
  async findById(id: number): Promise<Activity | null> {
    return prisma.activity.findUnique({
      where: { id },
    });
  }
}
