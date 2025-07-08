import { Router } from 'express';
import itineraryRouter from './itinerary.routes';
import travelPreferenceRouter from './travelPreference.routes';
import { authenticateUser, authorizeUser } from '../middlewares/auth.middleware';
import { UserController } from '../controllers/user.controller';
import {
  getTravelInterests,
  getTravelInterestById,
  createTravelInterest,
  updateTravelInterest,
  deleteTravelInterest,
} from '../controllers/travelInterest.controller';
import {
  getTravelPreferenceByUserId,
  createTravelPreference,
  updateTravelPreference,
  deleteTravelPreference,
} from '../controllers/travelPreference.controller';
//import { authMiddleware } from '../middlewares/error.middleware';

const router = Router();

//router.get('/', (req, res) => UserController.getAllUsers(req, res));
router.get('/:userId', authenticateUser, authorizeUser, UserController.getUserById);
router.post('/', UserController.createUser);
router.put('/:userId', authenticateUser, authorizeUser, UserController.updateUser);
router.delete('/:userId', authenticateUser, authorizeUser, UserController.deleteUser);
router.get('/', authenticateUser, UserController.getAllUsers);

router.get('/:userId/preferences', getTravelPreferenceByUserId);
router.post('/:userId/preferences', createTravelPreference);
router.put('/:userId/preferences', updateTravelPreference);
router.delete('/:userId/preferences', deleteTravelPreference);

router.get('/interests', getTravelInterests);
router.get('/interests/:id', getTravelInterestById);
router.post('/interests', createTravelInterest);
router.put('/interests/:id', updateTravelInterest);
router.delete('/interests/:id', deleteTravelInterest);

router.use('/:userId/itineraries', authenticateUser, authorizeUser, itineraryRouter);
router.use('/:userId/travel-preferences', authenticateUser, authorizeUser, travelPreferenceRouter);

router.get('/:id/profile', UserController.getUserProfile); // router.get('/me', authMiddleware, getUserProfile);
router.put('/:id/profile', UserController.updateUserProfile); // router.put('/me', authMiddleware, updateUserProfile);

router.get('/me', UserController.getUserProfile);
router.put('/me', UserController.updateUserProfile);

export default router;
