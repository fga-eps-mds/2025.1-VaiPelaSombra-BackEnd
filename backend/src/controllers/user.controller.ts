import { Request, Response } from 'express';
import { UserService } from '../services/user.service';

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    const users = await UserService.getAllUsers();
    //const users = [{"robson": "dada"}];
    res.json(users);
  },

  getUserById: async (req: Request, res: Response) => {
    const user = await UserService.getUserById(Number(req.params.id));
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  },

  createUser: async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email) {
      res.status(400).json({ message: 'Name and email are required' });
      return;
    }

    const newUser = await UserService.createUser({ name, email, password });
    res.status(201).json(newUser);
  },

  updateUser: async (req: Request, res: Response) => {
    const updatedUser = await UserService.updateUser(Number(req.params.id), req.body);

    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json(updatedUser);
  },

  deleteUser: async (req: Request, res: Response) => {
    const isDeleted = await UserService.deleteUser(Number(req.params.id));

    if (!isDeleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.status(204).send();
  },
};
