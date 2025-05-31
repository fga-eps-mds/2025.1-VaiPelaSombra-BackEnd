import { Request, Response } from 'express';
import { PrismaActivityRepository } from '../repositories/activity/activity.repository.prisma';
import { ActivityService } from '../services/activity.service';
import { CreateActivitySchema, UpdateActivitySchema } from '../dtos/activity.dto';

const activityRepository = new PrismaActivityRepository();
const activityService = new ActivityService(activityRepository);

export const createActivity = async (req: Request, res: Response) => {
  const itineraryId = parseInt(req.params.itineraryId);
  const data = CreateActivitySchema.parse({
    ...req.body,
    itineraryId,
  });
  const createdActivity = await activityService.create(data);
  res.status(201).json(createdActivity);
};

export const deleteActivity = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deletedActivity = await activityService.delete(id);
  res.status(204).send(deletedActivity);
};

export const updateActivity = async (req: Request, res: Response) => {
  const itineraryId = parseInt(req.params.itineraryId);
  const activityId = parseInt(req.params.id);
  const data = UpdateActivitySchema.parse({
    ...req.body,
  });
  const updatedActivity = await activityService.update(activityId, itineraryId, data);
  res.status(200).json(updatedActivity);
};
export const getActivities = async (req: Request, res: Response) => {
  const itineraryId = parseInt(req.params.itineraryId);
  const activities = await activityService.findAllOrderedByDate(itineraryId);
  res.status(200).json(activities);
};
