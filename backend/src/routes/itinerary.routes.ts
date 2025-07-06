import { Router } from 'express';
import {
  addUserToItinerary,
  createItinerary,
  deleteItinerary,
  findByUserId,
  // findByUserItineraryId,
  updateItinerary,
} from '../controllers/intinerary.controller';

import activityRouter from './activity.routes';
import { ItineraryController } from '../controllers/itinerary.controller';
import { ItineraryService } from '../services/itinerary.service';

const itineraryService = new ItineraryService();
const itineraryController = new ItineraryController(itineraryService);

const router = Router({ mergeParams: true });

router.post('/', itineraryController.createItinerary);
router.get('/', itineraryController.findByUserId);
router.put('/:itineraryId', itineraryController.updateItinerary);
router.delete('/:itineraryId', itineraryController.deleteItinerary);
router.use('/:itineraryId/activities', activityRouter);
router.post('/:itineraryId/users/:userId', addUserToItinerary);

export default router;
