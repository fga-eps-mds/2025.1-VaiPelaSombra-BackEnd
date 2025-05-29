import { IActivityRepository } from '../repositories/activity/activity.repository';
import { Activity, Prisma } from '../generated/prisma';
export class ActivityService {
  constructor(private activityRepository: IActivityRepository) {}
  async create(data: Prisma.ActivityCreateInput): Promise<Activity> {
    return this.activityRepository.create(data);
  }
  async delete(id: number): Promise<Activity | null> {
    return this.activityRepository.delete(id);
  }
  async update(id: number, data: Partial<Activity>): Promise<Activity | null> {
    return this.activityRepository.update(id, data);
  }
  async findAllOrderedByDate(): Promise<Activity[]> {
    return this.activityRepository.findAllOrderedByDate();
  }
}
