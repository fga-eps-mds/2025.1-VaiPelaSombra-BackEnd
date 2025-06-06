import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserPreferencesController } from '../controllers/userPreferences.controller';
import { TravelInterestsController } from '../controllers/travelInterests.controller';
const router = Router();

router.get('/', (req, res) => UserController.getAllUsers(req, res));
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
export default router;
