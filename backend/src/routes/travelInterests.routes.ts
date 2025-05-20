import { Router } from 'express';
import { TravelInterestsController } from '../controllers/travelInterests.controller';

const router = Router();

router.get('/', TravelInterestsController.getAllTravelInterests);

export default router;
