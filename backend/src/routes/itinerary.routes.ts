import { Router } from 'express';
import activityRouter from './activity.routes';
import {
  createItinerary,
  deleteItinerary,
  findByUserId,
  updateItinerary,
} from '../controllers/itinerary.controller';

const router = Router({ mergeParams: true });

router.post('/', createItinerary);

router.get('/', findByUserId);

router.delete('/', deleteItinerary);

router.put('/', updateItinerary);

router.use('/:itineraryId/activities', activityRouter);
export default router;
