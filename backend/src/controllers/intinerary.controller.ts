import { NextFunction, Request, Response } from 'express';
// import { PrismaItineraryRepository } from '../repositories/itinerary/itinerary.reposity.prisma';
import { ItineraryService } from '../services/itinerary.service';
import { CreateItinerarySchema, UpdateItinerarySchema } from '../dtos/itinerary.dto';
import { BadRequestError } from '../errors/httpError';

const itineraryService = new ItineraryService()

export const createItinerary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');

    const data = CreateItinerarySchema.parse({ ...req.body });

    data.totalBudget = (data.foodBudget ?? 0) + (data.lodgingBudget ?? 0);

    const itinerary = await itineraryService.create(userId, data);

    res.status(201).json(itinerary);
  } catch (error) {
    next(error);
  }
};

export const findByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const itinearies = await itineraryService.findByUserId(userId);
    res.status(200).json(itinearies);
  } catch (error) {
    next(error);
  }
};

export const findByUserItineraryId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = parseInt(req.params.userId);
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const itinearies = await itineraryService.findByUserItineraryId(userId, itineraryId);
    res.status(200).json(itinearies);
  } catch (error) {
    next(error);
  }
};

export const deleteItinerary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid user id');
    const deletedItinerary = await itineraryService.delete(itineraryId);
    res.status(200).json(deletedItinerary);
  } catch (error) {
    next(error);
  }
};

export const updateItinerary = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    const data = UpdateItinerarySchema.parse({ ...req.body });
    const itinerary = await itineraryService.update(itineraryId, data);
    res.status(201).json(itinerary);
  } catch (error) {
    next(error);
  }
};
