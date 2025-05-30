import { Prisma, Activity } from '../../generated/prisma';
export interface IActivityRepository {
  create(data: Prisma.ActivityCreateInput): Promise<Activity>;
  delete(id: number): Promise<Activity | null>;
  update(id: number, data: Prisma.ActivityUpdateInput): Promise<Activity | null>;
  findAllOrderedByDate(itineraryId: number): Promise<Activity[]>;
  findConflictingActivities(
    itineraryId: number,
    startTime: Date,
    endTime: Date
  ): Promise<Activity[]>;
}
