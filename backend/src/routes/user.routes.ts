import { Router } from 'express';
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '../controllers/user.controller';
import itineraryRouter from './itinerary.routes';
import travelPreferenceRouter from './travelPreference.routes';
const router = Router();
router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', getUserById);
router.put('/:userId', updateUser);
router.delete('/:userId', deleteUser);
router.use('/:userId/itineraries', itineraryRouter);
router.use('/:userId/travel-preferences', travelPreferenceRouter);

export default router;