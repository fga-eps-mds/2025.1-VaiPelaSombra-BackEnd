import { IActivityRepository } from '../repositories/activity/activity.repository';
import { Activity } from '../generated/prisma';
import { CreateActivityDTO, UpdateActivityDTO } from '../dtos/activity.dto';
import { differenceInMinutes } from 'date-fns';
export class ActivityService {
  constructor(private activityRepository: IActivityRepository) {}
  async create(data: CreateActivityDTO): Promise<Activity> {
    const { itineraryId, startTime, endTime } = data;

    const conflictingActivities = await this.activityRepository.findConflictingActivities(
      itineraryId,
      startTime,
      endTime
    );

    if (conflictingActivities.length > 0) {
      throw new Error('Activity conflicts with existing activities in the itinerary');
    }
    const durationInMinutes = differenceInMinutes(endTime, startTime);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const durationString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    data.duration = durationString;
    return this.activityRepository.create(data);
  }
  async delete(id: number): Promise<Activity | null> {
    return this.activityRepository.delete(id);
  }
  async update(
    activityId: number,
    itineraryId: number,
    data: UpdateActivityDTO
  ): Promise<Activity | null> {
    const existingActivity = await this.activityRepository.findById(activityId);

    if (!existingActivity) {
      throw new Error('Activity not found');
    }

    const startTime = data.startTime ? data.startTime : existingActivity.startTime;
    const endTime = data.endTime ? data.endTime : existingActivity.endTime;

    if (startTime >= endTime) {
      throw new Error();
    }
    const conflictingActivities = await this.activityRepository.findConflictingActivities(
      itineraryId,
      startTime,
      endTime
    );

    const otherActivities = conflictingActivities.filter((activity) => activity.id !== activityId);

    if (otherActivities.length > 0)
      throw new Error('Activity conflicts with existing activities in the itinerary');
    return this.activityRepository.update(activityId, data);
  }
  async findAllOrderedByDate(itineraryId: number): Promise<Activity[]> {
    return this.activityRepository.findAllOrderedByDate(itineraryId);
  }
}
