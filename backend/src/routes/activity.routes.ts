import { Router } from 'express';
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from '../controllers/activity.controller';

const router = Router({ mergeParams: true });

// Create
router.post('/', createActivity);
// Read
router.get('/', getActivities);
// Update
router.put('/:activityId', updateActivity);
// Delete
router.delete('/:activityId', deleteActivity);

export default router;
