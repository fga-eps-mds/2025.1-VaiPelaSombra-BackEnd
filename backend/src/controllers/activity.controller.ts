import { Request, Response } from 'express';
import { PrismaActivityRepository } from '../repositories/activity/actvity.repository.prisma';
import { ActivityService } from '../services/activity.service';
import { CreateActivitySchema } from '../dtos/activity/activity.dto';

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

export const deleteActivity = async (req, res) => {
  const id = parseInt(req.params.id);
  const deletedActivity = await activityService.delete(id);
  res.status(204).send(deletedActivity);
};

export const updateActivity = async (req: Request, res: Response) => {
  const itineraryId = parseInt(req.params.itineraryId);
  const { location, title, price, startTime, endTime, duration, description } = req.body;
  const data = {
    location,
    title,
    price,
    startTime,
    endTime,
    duration,
    description,
  };
  const updatedActivity = await activityService.update(itineraryId, data);
  res.status(200).json(updatedActivity);
};
export const getActivities = async (req: Request, res: Response) => {
  const itineraryId = parseInt(req.params.itineraryId);
  const activities = await activityService.findAllOrderedByDate(itineraryId);
  res.status(200).json(activities);
};
