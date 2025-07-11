import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
import { TravelPreferenceService } from '../services/travelPreference.service';
import { CreateUserSchema, UpdateUserSchema } from '../dtos/user.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';
import bcrypt from 'bcrypt';

const userService = new UserService();
const travelPreferenceService = new TravelPreferenceService();

export const UserController = {
  getAllUsers: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await userService.findAll();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  },

  getUserById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.id || req.params.userId);
      if (isNaN(userId)) throw new BadRequestError('Invalid user id');

      const user = await userService.findById(userId);
      if (!user) throw new NotFoundError('User not found');

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  createUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = CreateUserSchema.parse(req.body);
      data.password = await bcrypt.hash(data.password, 10);

      const user = await userService.create(data);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userResponse } = user;
      res.status(201).json(userResponse);
    } catch (error) {
      next(error);
    }
  },

  updateUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.id || req.params.userId);
      if (isNaN(userId)) throw new BadRequestError('Invalid user id');

      const data = UpdateUserSchema.parse(req.body);
      data.password = await bcrypt.hash(data.password, 10);
      const updatedUser = await userService.update(userId, data);
      if (!updatedUser) throw new NotFoundError('User not found');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...userResponse } = updatedUser;
      res.status(200).json(userResponse);
    } catch (error) {
      next(error);
    }
  },

  deleteUser: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = parseInt(req.params.id || req.params.userId);
      if (isNaN(userId)) throw new BadRequestError('Invalid user id');

      const deleted = await userService.delete(userId);
      if (!deleted) throw new NotFoundError('User not found');

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },

  getUserProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const user = await userService.findById(userId);
      if (!user) throw new NotFoundError('User not found');
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  },

  updateUserProfile: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = Number(req.params.id);
      const userData = req.body;

      const updatedUser = await userService.update(userId, userData);
      if (!updatedUser) throw new NotFoundError('User not found');

      if (userData.travelPreferencesData) {
        await travelPreferenceService.update(userId, userData.travelPreferencesData);
      }

      const userUpdated = await userService.findById(userId);
      res.status(200).json(userUpdated);
    } catch (error) {
      next(error);
    }
  },
};
