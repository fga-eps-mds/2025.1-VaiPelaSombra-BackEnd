import { IActivityRepository } from '../repositories/activity/activity.repository';
import { Activity } from '../generated/prisma';
import { CreateActivityDTO, UpdateActivityDTO } from '../dtos/activity/activity.dto';
export class ActivityService {
  constructor(private activityRepository: IActivityRepository) {}
  async create(data: CreateActivityDTO): Promise<Activity> {
    const { itineraryId, startTime, endTime } = data;

    const conflictingActivities = await this.activityRepository.findConflictingActivities(
      itineraryId,
      new Date(startTime),
      new Date(endTime)
    );

    if (conflictingActivities.length > 0) {
      throw new Error('Activity conflicts with existing activities in the itinerary');
    }

    const { location, title, price, duration, description } = data;

    return this.activityRepository.create({
      location,
      title,
      price,
      startTime,
      endTime,
      duration,
      description,
      itinerary: {
        connect: { id: itineraryId },
      },
    });
  }
  async delete(id: number): Promise<Activity | null> {
    return this.activityRepository.delete(id);
  }
  async update(id: number, data: UpdateActivityDTO): Promise<Activity | null> {
    const { itineraryId, startTime, endTime } = data;

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
