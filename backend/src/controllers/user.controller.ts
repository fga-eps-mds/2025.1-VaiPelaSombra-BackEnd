import { Request, Response } from 'express';
import { PrismaUserRepository } from '../repositories/user/user.repository.prisma';
import { UserService } from '../services/user.service';

const userRepository = new PrismaUserRepository();
const userService = new UserService(userRepository);

export const createUser = async (req: Request, res: Response) => {
  const { email, name, password } = req.body;

  const data = { email, name, password };
  const user = await userService.create(data);
  res.status(201).json(user);
  return;
};

export const getUserById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const user = await userService.findById(id);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(user);
  return;
};
export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.findAll();
  res.status(200).json(users);
  return;
};

export const updateUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedUser = await userService.update(id, req.body);
  if (!updatedUser) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(200).json(updatedUser);
  return;
};
export const deleteUser = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = await userService.delete(id);
  if (!deleted) {
    res.status(404).json({ message: 'User not found' });
    return;
  }
  res.status(204).send();
  return;
};
