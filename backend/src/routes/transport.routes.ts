import { Router } from 'express';
import { TransportController } from '../controllers/transport.controller';
import { authenticateUser } from '../middlewares/auth.middleware';

const router = Router();
const controller = new TransportController();

router.use(authenticateUser);

// Listar transportes de um itinerário
router.get(
  '/itineraries/:itineraryId/transports',
  controller.getTransportsByItinerary.bind(controller)
);

// Criar transporte para um itinerário
router.post('/itineraries/:itineraryId/transports', controller.createTransport.bind(controller));

router.get('/transports/:id', controller.getTransportById.bind(controller));
router.put('/transports/:id', controller.updateTransport.bind(controller));
router.delete('/transports/:id', controller.deleteTransport.bind(controller));

export default router;
