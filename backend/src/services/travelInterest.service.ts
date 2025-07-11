import { TravelInterest, Prisma } from '@prisma/client';
import { prisma } from '../data/prismaClient';

export class TravelInterestService {
  async create(data: Prisma.TravelInterestCreateInput): Promise<TravelInterest> {
    return prisma.travelInterest.create({ data });
  }

  async findById(id: number): Promise<TravelInterest | null> {
    return prisma.travelInterest.findUnique({ where: { id } });
  }

  async findAll(): Promise<TravelInterest[]> {
    return prisma.travelInterest.findMany();
  }

  async update(id: number, data: Prisma.TravelInterestUpdateInput): Promise<TravelInterest | null> {
    return prisma.travelInterest.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<TravelInterest | null> {
    return prisma.travelInterest.delete({ where: { id } });
  }
}
