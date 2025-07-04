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
import { authenticateUser, authorizeUser } from '../middlewares/auth.middleware';

const router = Router();
router.post('/', createUser);
router.get('/', authenticateUser, getUsers);
router.get('/:userId', authenticateUser, authorizeUser, getUserById);
router.put('/:userId', authenticateUser, authorizeUser, updateUser);
router.delete('/:userId', authenticateUser, authorizeUser, deleteUser);
router.use('/:userId/itineraries', authenticateUser, authorizeUser, itineraryRouter);
router.use('/:userId/travel-preferences', authenticateUser, authorizeUser, travelPreferenceRouter);

export default router;
