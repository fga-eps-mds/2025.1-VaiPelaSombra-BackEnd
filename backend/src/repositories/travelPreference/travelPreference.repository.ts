import { Prisma, TravelPreference } from '../../generated/prisma';
export interface ITravelPreferenceRepository {
  create(userId: number, data: Prisma.TravelPreferenceCreateInput): Promise<TravelPreference>;
  findByUserId(userId: number): Promise<TravelPreference | null>;
  update(
    userId: number,
    data: Prisma.TravelPreferenceUpdateInput
  ): Promise<TravelPreference | null>;
  delete(userId: number): Promise<TravelPreference | null>;
}
