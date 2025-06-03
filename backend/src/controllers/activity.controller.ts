import { NextFunction, Request, Response } from 'express';
import { ActivityService } from '../services/activity.service';
import { CreateActivitySchema, UpdateActivitySchema } from '../dtos/activity.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';

const activityService = new ActivityService();

export const createActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    const data = CreateActivitySchema.parse({
      ...req.body,
      itineraryId,
    });
    const createdActivity = await activityService.create(data);
    res.status(201).json(createdActivity);
  } catch (error) {
    next(error);
  }
};

export const deleteActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const activityId = parseInt(req.params.activityId);
    if (isNaN(activityId)) throw new BadRequestError('Invalid activity id');
    const deletedActivity = await activityService.delete(activityId);
    if (!deletedActivity) throw new NotFoundError('Activity not found');
    res.status(200).send(deletedActivity);
  } catch (error) {
    next(error);
  }
};

export const updateActivity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itineraryId = parseInt(req.params.itineraryId);
    const activityId = parseInt(req.params.activityId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    if (isNaN(activityId)) throw new BadRequestError('Invalid activity id');
    const data = UpdateActivitySchema.parse({
      ...req.body,
    });
    const updatedActivity = await activityService.update(activityId, itineraryId, data);
    res.status(200).json(updatedActivity);
  } catch (error) {
    next(error);
  }
};
export const getActivities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itineraryId = parseInt(req.params.itineraryId);
    const userId = parseInt(req.params.userId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const activities = await activityService.findAllOrderedByDate(itineraryId, userId);
    res.status(200).json(activities);
  } catch (error) {
    next(error);
  }
};
