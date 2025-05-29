import { Router } from 'express';
import {
  createTravelInterest,
  getTravelInterests,
  getTravelInterestById,
  updateTravelInterest,
  deleteTravelInterest,
} from '../controllers/travelInterest.controller';

const router = Router();

router.post('/', createTravelInterest);
router.get('/', getTravelInterests);
router.get('/:id', getTravelInterestById);
router.put('/:id', updateTravelInterest);
router.delete('/:id', deleteTravelInterest);
export default router;
