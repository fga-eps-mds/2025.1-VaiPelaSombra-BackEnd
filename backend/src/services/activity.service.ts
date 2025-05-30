import { IActivityRepository } from '../repositories/activity/activity.repository';
import { Activity, Prisma } from '../generated/prisma';
export class ActivityService {
  constructor(private activityRepository: IActivityRepository) {}
  async create(data: Prisma.ActivityCreateInput): Promise<Activity> {
    const { itinerary, startTime, endTime } = data;

    const itineraryId = itinerary.connect.id;

    const conflictingActivities = await this.activityRepository.findConflictingActivities(
      itineraryId,
      new Date(startTime),
      new Date(endTime)
    );
    if (conflictingActivities.length > 0) {
      throw new Error('Activity conflicts with existing activities in the itinerary');
    }
    return this.activityRepository.create(data);
  }
  async delete(id: number): Promise<Activity | null> {
    return this.activityRepository.delete(id);
  }
  async update(id: number, data: Prisma.ActivityUpdateInput): Promise<Activity | null> {
    const { itinerary, startTime, endTime } = data;

    const itineraryId = itinerary.connect.id;

    const conflictingActivities = await this.activityRepository.findConflictingActivities(
      itineraryId,
      new Date(startTime),
      new Date(endTime)
    );
    if (conflictingActivities.length > 0) {
      throw new Error('Activity conflicts with existing activities in the itinerary');
    }
    return this.activityRepository.update(id, data);
  }
  async findAllOrderedByDate(itineraryId: number): Promise<Activity[]> {
    return this.activityRepository.findAllOrderedByDate(itineraryId);
  }
}
