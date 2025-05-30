import { Router } from 'express';
import {
  deleteTravelPreference,
  getTravelPreferenceByUserId,
  updateTravelPreference,
  createTravelPreference,
} from '../controllers/travelPreference.controller';

const router = Router({ mergeParams: true });
router.get('/:id/preferences', getTravelPreferenceByUserId);

router.post('/:id/preferences', createTravelPreference);

router.put('/:id/preferences', updateTravelPreference);
router.delete('/:id/preferences', deleteTravelPreference);

export default router;
