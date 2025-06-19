import { Router } from 'express';
import itineraryRouter from './itinerary.routes';
import travelPreferenceRouter from './travelPreference.routes';
import { UserController } from '../controllers/user.controller';
import { UserPreferencesController } from '../controllers/userPreferences.controller';
import { TravelInterestsController } from '../controllers/travelInterests.controller';
//import { authMiddleware } from '../middlewares/error.middleware';

const router = Router();

//router.get('/', (req, res) => UserController.getAllUsers(req, res));
router.get('/:id', (req, res) => UserController.getUserById(req, res));
router.post('/', (req, res) => UserController.createUser(req, res));
router.put('/:id', (req, res) => UserController.updateUser(req, res));
router.delete('/:id', (req, res) => UserController.deleteUser(req, res));
router.get('/:id/preferences', UserPreferencesController.getUserTravelPreferencesByUserId);
router.post('/:id/preferences', UserPreferencesController.saveUserTravelPreferences);
router.put('/:id/preferences', UserPreferencesController.saveUserTravelPreferences);
router.get('/:id/interests', TravelInterestsController.getUserTravelInterestsByUserId);
router.post('/:id/interests', TravelInterestsController.saveUserTravelInterests);
router.put('/:id/interests', TravelInterestsController.saveUserTravelInterests);
router.use('/:userId/itineraries', itineraryRouter);
router.use('/:userId/travel-preferences', travelPreferenceRouter);
router.get('/:id/profile', UserController.getUserProfile); // router.get('/me', authMiddleware, getUserProfile);
router.put('/:id/profile', UserController.updateUserProfile); // router.put('/me', authMiddleware, updateUserProfile);
router.get('/me', UserController.getUserProfile);
router.put('/me', UserController.updateUserProfile);

export default router;
