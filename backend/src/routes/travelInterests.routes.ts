import { Router } from 'express';
import {
  createTravelInterest,
  getTravelInterests,
  getTravelInterestById,
  updateTravelInterest,
  deleteTravelInterest,
} from '../controllers/travelInterest.controller';

const router = Router();
//Create
router.post('/', createTravelInterest);
//Read
router.get('/', getTravelInterests);
router.get('/:id', getTravelInterestById);
//Update
router.put('/:id', updateTravelInterest);
//Delete
router.delete('/:id', deleteTravelInterest);

export default router;
