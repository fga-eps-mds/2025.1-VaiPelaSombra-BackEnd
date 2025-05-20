import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
  getAllUsers: (req: Request, res: Response): void => {
    const users = UserService.getAllUsers();
    //const users = [{"robson": "dada"}];
    res.json(users);
  },

  getUserById: (req: Request, res: Response): void => {
    const user = UserService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  },

  createUser: (req: Request, res: Response): void => {
    const { name, email, password } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    const newUser = UserService.createUser({ name, email, password });
    res.status(201).json(newUser);
  },

  updateUser: (req: Request, res: Response): void => {
    const updatedUser = UserService.updateUser(Number(req.params.id), req.body);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  },

  deleteUser: (req: Request, res: Response): void => {
    const isDeleted = UserService.deleteUser(Number(req.params.id));

    if (!isDeleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(204).send();
  },
};
