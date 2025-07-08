import { Request, Response } from 'express';
import { ItineraryService } from '../services/itinerary.service';
import { CreateItinerarySchema, UpdateItinerarySchema } from '../dtos/itinerary.dto';
import { BadRequestError } from '../errors/httpError';
import { AuthRequest } from '../middlewares/auth.middleware';

export class ItineraryController {
  constructor(private itineraryService: ItineraryService) {}

  createItinerary = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const data = CreateItinerarySchema.parse(req.body);
    data.totalBudget = (data.foodBudget ?? 0) + (data.lodgingBudget ?? 0);
    const itinerary = await this.itineraryService.create(userId, data);
    res.status(201).json(itinerary);
  };

  findByUserId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const itineraries = await this.itineraryService.findByUserId(userId);
    res.status(200).json(itineraries);
  };

  findByUserItineraryId = async (req: Request, res: Response) => {
    const userId = parseInt(req.params.userId);
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(userId) || isNaN(itineraryId)) throw new BadRequestError('Invalid id');
    const itineraries = await this.itineraryService.findByUserItineraryId(userId, itineraryId);
    res.status(200).json(itineraries);
  };

  deleteItinerary = async (req: AuthRequest, res: Response) => {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    const userId = req.user!.id;
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const deletedItinerary = await this.itineraryService.delete(itineraryId, userId);
    res.status(200).json(deletedItinerary);
  };

  updateItinerary = async (req: AuthRequest, res: Response) => {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    const userId = req.user!.id;
    if (isNaN(userId)) throw new BadRequestError('Invalid user id');
    const data = UpdateItinerarySchema.parse({ ...req.body });
    const itinerary = await this.itineraryService.update(itineraryId, userId, data);
    res.status(200).json(itinerary);
  };

  addUserToItinerary = async (req: Request, res: Response) => {
    const itineraryId = parseInt(req.params.itineraryId);
    const userId = parseInt(req.params.userId);
    if (isNaN(itineraryId) || isNaN(userId)) throw new BadRequestError('Invalid id');
    const itinerary = await this.itineraryService.addUserToItinerary(itineraryId, userId);
    res.status(200).json(itinerary);
  };
}
