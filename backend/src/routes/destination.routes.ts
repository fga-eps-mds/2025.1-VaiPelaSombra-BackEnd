import { Router } from 'express';
import { DestinationsController } from '../controllers/destination.controller';

const router = Router();
const destinationsController = new DestinationsController();

router.get('/',destinationsController.getAllDestinations); 
router.get('/:id', destinationsController.getDestinationById);

export default router;