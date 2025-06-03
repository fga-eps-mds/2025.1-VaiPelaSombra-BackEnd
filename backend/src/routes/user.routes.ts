import { Router } from 'express';
import { createUser, deleteUser, getUserById, getUsers, updateUser } from '../controllers/user.controller';
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

export default router;