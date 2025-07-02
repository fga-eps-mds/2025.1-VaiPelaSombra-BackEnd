import { Router } from 'express';
import {
  createItinerary,
  deleteItinerary,
  findByUserId,
  // findByUserItineraryId,
  updateItinerary,
} from '../controllers/itinerary.controller';

import activityRouter from './activity.routes';
const router = Router({ mergeParams: true });

router.post('/', createItinerary);
router.get('/', findByUserId);
//router.get('/:itineraryId', findByItineraryId);
router.put('/:itineraryId', updateItinerary);
router.delete('/:itineraryId', deleteItinerary);
router.use('/:itineraryId/activities', activityRouter);
export default router;
