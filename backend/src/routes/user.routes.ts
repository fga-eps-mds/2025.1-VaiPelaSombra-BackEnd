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

//Create
router.post('/', createUser);
//Read
router.get('/', getUsers);
router.get('/:userId', getUserById);
// Update
router.put('/:userId', updateUser);
// Delete
router.delete('/:userId', deleteUser);

router.use('/:userId/itineraries', itineraryRouter);
router.use('/:userId/preferences', travelPreferenceRouter);
export default router;
