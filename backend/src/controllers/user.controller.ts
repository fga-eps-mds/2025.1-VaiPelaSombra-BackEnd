import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
  getAllUsers: (req: Request, res: Response): void => {
    const users = UserService.getAllUsers();
    //const users = [{"robson": "dada"}];
    res.json(users);
  },

  getUserById: (req: Request, res: Response): void => {
    const user = UserService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  },

  createUser: (req: Request, res: Response): void => {
    const { name, email, age } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    const newUser = UserService.createUser({ name, email, age });
    res.status(201).json(newUser);
  },

  updateUser: (req: Request, res: Response): void => {
    const updatedUser = UserService.updateUser(req.params.id, req.body);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  },

  deleteUser: (req: Request, res: Response): void => {
    const isDeleted = UserService.deleteUser(req.params.id);

    if (!isDeleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(204).send();
  },

  getUserTravelPreferencesByUserId: async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const userPreferences = await UserService.getUserTravelPreferencesByUserId(userId);
      if (!userPreferences) {
        res.status(404).json({ message: 'User travel preferences not found' });
        return;
      }
      res.status(200).json(userPreferences);
    } catch (error) {
      res.status(500).json(error);
      return;
    }
  },

  saveUserTravelPreferences: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { travelPreferences } = req.body;

      const savedPreferences = await UserService.saveUserTravelPreferences(id, travelPreferences);
      res.status(201).json(savedPreferences);
    } catch (error) {
      res.status(500).json(error);
      return;
    }
  },

  getUserTravelInterestsByUserId: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userInterests = await UserService.getUserTravelInterestsByUserId(id);
      if (!userInterests) {
        res.status(404).json({ message: 'User travel interests not found' });
        return;
      }
      res.status(200).json(userInterests);
    } catch (error) {
      res.status(500).json(error);
      return;
    }
  },

  saveUserTravelInterests: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { travelInterestsIds } = req.body;
      if (travelInterestsIds.length === 0) {
        res.status(400).json({ message: 'No travel interests provided' });
        return;
      }
      const savedInterests = await UserService.saveUserTravelInterests(id, travelInterestsIds);
      res.status(201).json(savedInterests);
    } catch (error) {
      res.status(500).json(error);
      return;
    }
  },
};
