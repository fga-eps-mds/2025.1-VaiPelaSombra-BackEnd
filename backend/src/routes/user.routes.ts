import { Router } from 'express';
import itineraryRouter from './itinerary.routes';
import travelPreferenceRouter from './travelPreference.routes';
import { UserController } from '../controllers/user.controller';
import {
  getTravelInterests,
  getTravelInterestById,
  createTravelInterest,
  updateTravelInterest,
  deleteTravelInterest
} from '../controllers/travelInterest.controller';
import {
  getTravelPreferenceByUserId,
  createTravelPreference,
  updateTravelPreference,
  deleteTravelPreference
} from '../controllers/travelPreference.controller';
//import { authMiddleware } from '../middlewares/error.middleware';

const router = Router();

//router.get('/', (req, res) => UserController.getAllUsers(req, res));
router.get('/:id', (req, res) => UserController.getUserById(req, res));
router.post('/', (req, res) => UserController.createUser(req, res));
router.put('/:id', (req, res) => UserController.updateUser(req, res));
router.delete('/:id', (req, res) => UserController.deleteUser(req, res));

router.get('/:userId/preferences', getTravelPreferenceByUserId);
router.post('/:userId/preferences', createTravelPreference);
router.put('/:userId/preferences', updateTravelPreference);
router.delete('/:userId/preferences', deleteTravelPreference);

router.get('/interests', getTravelInterests);
router.get('/interests/:id', getTravelInterestById);
router.post('/interests', createTravelInterest);
router.put('/interests/:id', updateTravelInterest);
router.delete('/interests/:id', deleteTravelInterest);

router.use('/:userId/itineraries', itineraryRouter);
router.use('/:userId/travel-preferences', travelPreferenceRouter);

router.get('/:id/profile', UserController.getUserProfile); // router.get('/me', authMiddleware, getUserProfile);
router.put('/:id/profile', UserController.updateUserProfile); // router.put('/me', authMiddleware, updateUserProfile);

router.get('/me', UserController.getUserProfile);
router.put('/me', UserController.updateUserProfile);

export default router;

