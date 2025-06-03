import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { CreateUserSchema } from '../dtos/user.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';

const userService = new UserService();

export const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateUserSchema.parse(req.body);
    const user = await userService.create(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = user;
    res.status(201).json(userResponse);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const user = await userService.findById(userId);
    if (!user) throw new NotFoundError('User not found');
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userService.findAll();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const updatedUser = await userService.update(userId, req.body);
    if (!updatedUser) throw new NotFoundError('User not found');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResponse } = updatedUser;
    res.status(200).json(userResponse);
  } catch (error) {
    next(error);
  }
};
export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const deleted = await userService.delete(userId);
    if (!deleted) throw new NotFoundError('User not found');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
