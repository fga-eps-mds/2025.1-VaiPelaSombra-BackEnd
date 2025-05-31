import { TravelInterest, Prisma } from '../../generated/prisma';

export interface ITravelInterestRepository {
  create(data: Prisma.TravelInterestCreateInput): Promise<TravelInterest>;
  findById(id: number): Promise<TravelInterest | null>;
  findAll(): Promise<TravelInterest[]>;
  update(id: number, data: Prisma.TravelInterestUpdateInput): Promise<TravelInterest | null>;
  delete(id: number): Promise<TravelInterest | null>;
}
