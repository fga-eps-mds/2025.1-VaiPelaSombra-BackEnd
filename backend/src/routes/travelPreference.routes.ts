import { Router } from 'express';
import {
  deleteTravelPreference,
  getTravelPreferenceByUserId,
  updateTravelPreference,
  createTravelPreference,
} from '../controllers/travelPreference.controller';

const router = Router({ mergeParams: true });
router.get('/', getTravelPreferenceByUserId);
router.post('/', createTravelPreference);
router.put('/', updateTravelPreference);
router.delete('/', deleteTravelPreference);

export default router;
