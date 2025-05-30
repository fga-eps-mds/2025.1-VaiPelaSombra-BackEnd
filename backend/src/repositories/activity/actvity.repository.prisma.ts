import { prisma } from '../../data/prismaClient';
import { Prisma, Activity } from '../../generated/prisma';
import { IActivityRepository } from './activity.repository';
export class PrismaActivityRepository implements IActivityRepository {
  async create(data: Prisma.ActivityCreateInput): Promise<Activity> {
    return prisma.activity.create({ data });
  }
  async delete(id: number): Promise<Activity | null> {
    return prisma.activity.delete({
      where: { id },
    });
  }
  async update(id: number, data: Prisma.ActivityUpdateInput): Promise<Activity | null> {
    return prisma.activity.update({
      where: { id },
      data,
    });
  }
  async findAllOrderedByDate(): Promise<Activity[]> {
    return prisma.activity.findMany({
      orderBy: { startTime: 'asc' },
    });
  }
}
