import { Router } from 'express';
import { upload } from '../config/multer';
import { DestinationController } from '../controllers/destination.controller';
import { DestinationService } from '../services/destination.service';

const destinationService = new DestinationService();
const destinationController = new DestinationController(destinationService);
const router = Router();

router.post('/', destinationController.createDestination);
router.get('/', destinationController.getAllDestinations);
router.get('/:destinationId', destinationController.getDestinationById);
router.put('/:destinationId', destinationController.updateDestination);
router.delete('/:destinationId', destinationController.deleteDestination);

router.post(
  '/:destinationId/images',
  upload.single('file'),
  destinationController.uploadDestinationImage
);
router.get('/:destinationId/images', destinationController.getDestinationImages);

export default router;