import { Router } from 'express';
import {
  createDestination,
  deleteDestination,
  getAllDestinations,
  getDestinationById,
  updateDestination,
} from '../controllers/destination.controller';

const router = Router();

router.post('/', createDestination);
router.get('/', getAllDestinations);
router.get('/:destinationId', getDestinationById);
router.put('/:destinationId', updateDestination);
router.delete('/:destinationId', deleteDestination);

export default router;
