import { Router } from 'express';
import { travelInterestsController } from '../controllers/travelInterests.controller';

const router = Router();

router.get('/', travelInterestsController.getAllTravelInterests);

export default router;
