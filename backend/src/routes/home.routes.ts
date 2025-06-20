import { Router } from 'express';
import { handleFindDestinations, handleGetDestinationById } from '../controllers/home.controller';

const router = Router();

router.get('/', handleFindDestinations);
router.get('/:id', handleGetDestinationById);

export default router;
