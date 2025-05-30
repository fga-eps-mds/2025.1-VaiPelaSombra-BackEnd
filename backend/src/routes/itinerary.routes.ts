import { Router } from 'express';

import {
  createItinerary,
  deleteItinerary,
  findByUserId,
  updateItinerary,
} from '../controllers/itinerary.controller';

import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from '../controllers/activity.controller';
const router = Router({ mergeParams: true });

router.post('/', createItinerary);

router.get('/', findByUserId);

router.delete('/', deleteItinerary);

router.put('/', updateItinerary);

router.post('/:itineraryId/activities', createActivity);
router.get('/:itineraryId/activities', getActivities);
router.delete('/:itineraryId/activities/:id', deleteActivity);
router.put('/:itineraryId/activities/:id', updateActivity);
export default router;
