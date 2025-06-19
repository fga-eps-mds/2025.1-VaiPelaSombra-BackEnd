import { Router } from 'express';
import {
  createDestination,
  deleteDestination,
  getAllDestinations,
  getDestinationById,
  getDestinationImages,
  updateDestination,
  uploadDestinationImage,
} from '../controllers/destination.controller';
import { upload } from '../config/multer';

const router = Router();

router.post('/', createDestination);
router.get('/', getAllDestinations);
router.get('/:destinationId', getDestinationById);
router.put('/:destinationId', updateDestination);
router.delete('/:destinationId', deleteDestination);
router.post('/:destinationId/images', upload.single('file'), uploadDestinationImage);
router.get('/:destinationId/images', getDestinationImages);
export default router;
