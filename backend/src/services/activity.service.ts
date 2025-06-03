import { prisma } from '../data/prismaClient';
import { CreateActivityDTO, UpdateActivityDTO } from '../dtos/activity.dto';
import { BadRequestError, ConflictError, NotFoundError } from '../errors/httpError';
import { Activity, Prisma } from '../generated/prisma';
import { differenceInMinutes } from 'date-fns';

export class ActivityService {
  async create(data: CreateActivityDTO): Promise<Activity> {
    const { itineraryId, startTime, endTime } = data;

    if (startTime >= endTime) throw new BadRequestError('Invalid start/end time');
    const conflictingActivities = await this.findConflictingActivities(
      itineraryId,
      startTime,
      endTime
    );

    if (conflictingActivities.length > 0)
      throw new ConflictError('Activity conflicts with existing activities in the itinerary');

    const durationInMinutes = differenceInMinutes(endTime, startTime);
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    const durationString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    data.duration = durationString;

    const prismaData: Prisma.ActivityCreateInput = {
      ...data,
      itinerary: { connect: { id: itineraryId } },
    };
    return prisma.activity.create({ data: prismaData });
  }

  async delete(id: number): Promise<Activity | null> {
    return prisma.activity.delete({
      where: { id },
    });
  }
  async update(    
    activityId: number,
    itineraryId: number,
    data: UpdateActivityDTO
  ): Promise<Activity | null> {

    const existingActivity = await this.findById(activityId);

    if (!existingActivity) throw new NotFoundError('Activity not found');

    const startTime = data.startTime ? data.startTime : existingActivity.startTime;
    const endTime = data.endTime ? data.endTime : existingActivity.endTime;

    if (startTime >= endTime) throw new BadRequestError('Invalid start/end time');
    const conflictingActivities = await this.findConflictingActivities(
      itineraryId,
      startTime,
      endTime
    );

    const otherActivities = conflictingActivities.filter((activity) => activity.id !== activityId);

    if (otherActivities.length > 0)
      throw new ConflictError('Activity conflicts with existing activities in the itinerary');

    return prisma.activity.update({
      where: { id: activityId },
      data,
    });
  }
  async findAllOrderedByDate(itineraryId: number, userId: number): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        itineraryId,
        itinerary: {
          users: {
            some: { id: userId },
          },
        },
      },
      orderBy: { startTime: 'asc' },
    });
  }

  async findConflictingActivities(
    itineraryId: number,
    startTime: Date,
    endTime: Date
  ): Promise<Activity[]> {
    return prisma.activity.findMany({
      where: {
        itineraryId,
        AND: [
          {
            startTime: {
              lte: endTime,
            },
          },
          {
            endTime: {
              gte: startTime,
            },
          },
        ],
      },
    });
  }
  async findById(id: number): Promise<Activity | null> {
    return prisma.activity.findUnique({
      where: { id },
    });
  }
}

