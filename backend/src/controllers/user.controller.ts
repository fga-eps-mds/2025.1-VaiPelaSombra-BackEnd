import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { User } from '../models/user.model';

export const UserController = {
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    const users = await UserService.getAllUsers();
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

  createUser: async (req: Request, res: Response): Promise<void> => {
    const { name, email, password } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    try {
      const newUser = await UserService.createUser({ name, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
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
