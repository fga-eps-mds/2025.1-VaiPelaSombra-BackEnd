import { Router } from 'express';
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from '../controllers/activity.controller';

const router = Router({ mergeParams: true });

router.post('/', createActivity);
router.get('/', getActivities);
router.put('/:activityId', updateActivity);
router.delete('/:activityId', deleteActivity);

export default router;
