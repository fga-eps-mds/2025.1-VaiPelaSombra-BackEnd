import { Router } from 'express';
import {
  deleteTravelPreference,
  getTravelPreferenceByUserId,
  updateTravelPreference,
  createTravelPreference,
} from '../controllers/travelPreference.controller';

const router = Router({ mergeParams: true });
//Create
router.get('/:userId', getTravelPreferenceByUserId);
//Read
router.post('/:userId', createTravelPreference);
//Update
router.put('/:userId', updateTravelPreference);
//Delete
router.delete('/:userId', deleteTravelPreference);

export default router;
