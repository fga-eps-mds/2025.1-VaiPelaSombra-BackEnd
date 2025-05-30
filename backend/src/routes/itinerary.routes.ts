import { Router } from 'express';

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

export default router;
