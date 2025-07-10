import { Router } from 'express';
import { TransportController } from '../controllers/transport.controller';

const router = Router();
const controller = new TransportController();

router.post('/', controller.createTransport.bind(controller));
router.get('/', controller.getAllTransports.bind(controller));
router.get('/:id', controller.getTransportById.bind(controller));
router.put('/:id', controller.updateTransport.bind(controller));
router.delete('/:id', controller.deleteTransport.bind(controller));

export default router;
