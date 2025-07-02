import { Router } from 'express';
import {
  createTransport,
  deleteTransport,
  getAllTransports,
  getTransportById,
  updateTransport,
} from '../controllers/transport.controller';

const router = Router();

router.post('/', createTransport);
router.get('/', getAllTransports);
router.get('/:idTransporte', getTransportById);
router.put('/:idTransporte', updateTransport);
router.delete('/:idTransporte', deleteTransport);

export default router;
