import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { AuthenticatedRequest } from '../middlewares/error.middleware';

const userService = new UserService();

export const UserController = {
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
  getUserProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      const user = await UserService.getUserById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user profile', error });
    }
  },
  updateUserProfile: async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const userId = Number(req.user.id);
      const userData = req.body;
      const updatedUser = await UserService.updateUser(userId, userData);
      if (userData.travelPreferencesData) {
        await UserService.updateTravelPreferences(userId, userData.travelPreferencesData);
      }
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      const userUpdated = await UserService.getUserById(userId);
      res.status(200).json(userUpdated);
    } catch (error) {
      res.status(500).json({ message: 'Erro updating user profile', error });
    }
  },
};
