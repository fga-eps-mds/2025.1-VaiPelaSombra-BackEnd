import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { TravelPreferenceService } from '../services/travelPreference.service';

const userService = new UserService();
const travelPreferenceService = new TravelPreferenceService();

export const UserController = {
  getAllUsers: async (req: Request, res: Response): Promise<void> => {
    const users = await userService.findAll();
    res.json(users);
  },

  getUserById: async (req: Request, res: Response): Promise<void> => {
    const user = await userService.findById(Number(req.params.id));
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
      const newUser = await userService.create({ name, email, password });
      res.status(201).json(newUser);
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  },

  updateUser: async (req: Request, res: Response): Promise<void> => {
    const updatedUser = await userService.update(
      Number(req.params.id),
      req.body
    );

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  },

  deleteUser: async (req: Request, res: Response): Promise<void> => {
    const isDeleted = await userService.delete(Number(req.params.id));

    if (!isDeleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(204).send();
  },

  getUserProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.id); // ou req.user.id se estiver autenticado
      const user = await userService.findById(userId);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({
        message: 'Error fetching user profile',
        error: error instanceof Error ? error.message : error,
      });
    }
  },

  updateUserProfile: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;

      const updatedUser = await userService.update(userId, userData);
      if (!updatedUser) {
        res.status(404).json({ message: 'User not found' });
        return;
      }

      if (userData.travelPreferencesData) {
        await travelPreferenceService.update(userId, userData.travelPreferencesData);
      }

      const userUpdated = await userService.findById(userId);
      res.status(200).json(userUpdated);
    } catch (error) {
      console.error('Erro inesperado:', error);
      res.status(500).json({
        message: 'Erro updating user profile',
        error: error instanceof Error ? error.message : error,
      });
    }
  },
};
