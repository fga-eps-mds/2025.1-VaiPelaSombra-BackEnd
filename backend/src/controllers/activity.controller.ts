import { error } from 'console';
import { PrismaActivityRepository } from '../repositories/activity/actvity.repository.prisma';
import { ActivityService } from '../services/activity.service';

const activityRepository = new PrismaActivityRepository();
const activityService = new ActivityService(activityRepository);

export const createActivity = async (req, res) => {
  try {
    const itineraryId = parseInt(req.params.itineraryId);
    const { location, title, price, startTime, endTime, duration } = req.body;
    const data = {
      location,
      title,
      price,
      startTime,
      endTime,
      duration,
      itineraryId,
    };
    const activity = await activityService.create(data);
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json(error);
  }
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
export const updateActivity = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedActivity = await activityService.update(id, req.body);
    if (!updatedActivity) {
      return res.status(404).json(error);
    }
    res.status(200).json(updatedActivity);
  } catch (error) {
    res.status(500).json(error);
  }
};
export const getActivities = async (req, res) => {
  try {
    const activities = await activityService.findAllOrderedByDate();
    res.status(200).json(activities);
  } catch (error) {
    res.status(500).json(error);
  }
};
