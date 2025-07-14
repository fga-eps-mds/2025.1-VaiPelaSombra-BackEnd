import { Router } from 'express';

import activityRouter from './activity.routes';
import transportRouter from './transport.routes'; // Importa as rotas de transporte

import { ItineraryController } from '../controllers/itinerary.controller';
import { ItineraryService } from '../services/itinerary.service';

const itineraryService = new ItineraryService();
const itineraryController = new ItineraryController(itineraryService);

const router = Router({ mergeParams: true });

router.post('/', itineraryController.createItinerary);
router.get('/', itineraryController.findByUserId);
router.put('/:itineraryId', itineraryController.updateItinerary);
router.delete('/:itineraryId', itineraryController.deleteItinerary);
router.post('/:itineraryId/users/:userId', itineraryController.addUserToItinerary);

router.use('/:itineraryId/activities', activityRouter);
router.use('/:itineraryId/transports', transportRouter);

export default router;
