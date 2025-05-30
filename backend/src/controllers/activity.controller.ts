import { Request, Response } from 'express';
import { PrismaActivityRepository } from '../repositories/activity/actvity.repository.prisma';
import { ActivityService } from '../services/activity.service';

const activityRepository = new PrismaActivityRepository();
const activityService = new ActivityService(activityRepository);

export const createActivity = async (req: Request, res: Response) => {
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
    itinerary: {
      connect: { id: itineraryId },
    },
  };
  const activity = await activityService.create(data);
  res.status(201).json(activity);
};
export const deleteActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedActivity = await activityService.delete(id);
    if (!deletedActivity) {
      return res.status(404).json({ message: 'Activity not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json(error);
  }
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
