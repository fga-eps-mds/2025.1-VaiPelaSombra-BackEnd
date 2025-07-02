import { NextFunction, Request, Response } from 'express';
import { TravelPreferenceService } from '../services/travelPreference.service';
import { BadRequestError, NotFoundError } from '../errors/httpError';

const travelPreferenceService = new TravelPreferenceService();

export const createTravelPreference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');

    const { travelerType, travelFrequency, averageBudget, travelInterestIds } = req.body;

    const data = {
      travelerType,
      travelFrequency,
      averageBudget,
      travelInterests: {
        connect: travelInterestIds?.map((id: number) => ({ id })) || [],
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };

    const travelPreference = await travelPreferenceService.create(userId, data);
    res.status(201).json(travelPreference);
  } catch (error) {
    next(error);
  }
};

export const getTravelPreferenceByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');

    const travelPreference = await travelPreferenceService.findByUserId(userId);
    res.status(200).json(travelPreference);
  } catch (error) {
    next(error);
  }
};

export const deleteTravelPreference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');

    const deletedTravelPreference = await travelPreferenceService.delete(userId);
    if (!deletedTravelPreference) throw new NotFoundError('Preferences not found');

    res.status(200).json(deletedTravelPreference);
  } catch (error) {
    next(error);
  }
};

export const updateTravelPreference = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');

    const { travelerType, travelFrequency, averageBudget, travelInterestIds } = req.body;

    const data = {
      travelerType,
      travelFrequency,
      averageBudget,
      travelInterests: {
        set: travelInterestIds?.map((id: number) => ({ id })) || [],
      },
      user: {
        connect: {
          id: userId,
        },
      },
    };

    const travelPreference = await travelPreferenceService.update(userId, data);
    res.status(200).json(travelPreference);
  } catch (error) {
    next(error);
  }
};
