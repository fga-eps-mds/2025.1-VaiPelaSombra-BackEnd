import { CreateActivityDTO, UpdateActivityDTO } from '../../dtos/activity.dto';
import { Activity } from '../../generated/prisma';
export interface IActivityRepository {
  create(data: CreateActivityDTO): Promise<Activity>;
  delete(id: number): Promise<Activity | null>;
  update(id: number, data: UpdateActivityDTO): Promise<Activity | null>;
  findAllOrderedByDate(itineraryId: number): Promise<Activity[]>;
  findConflictingActivities(
    itineraryId: number,
    startTime: Date,
    endTime: Date
  ): Promise<Activity[]>;
  findById(id: number): Promise<Activity | null>;
}
