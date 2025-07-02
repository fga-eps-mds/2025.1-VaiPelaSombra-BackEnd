import { Request, Response } from 'express';
import { ItineraryService } from '../services/itinerary.service';
import { CreateItinerarySchema, UpdateItinerarySchema } from '../dtos/itinerary.dto';
import { BadRequestError } from '../errors/httpError';

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
  deleteItinerary = async (req: Request, res: Response) => {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid user id');
    const deletedItinerary = await this.itineraryService.delete(itineraryId);
    res.status(200).json(deletedItinerary);
  };

  updateItinerary = async (req: Request, res: Response) => {
    const itineraryId = parseInt(req.params.itineraryId);
    if (isNaN(itineraryId)) throw new BadRequestError('Invalid itinerary id');
    const data = UpdateItinerarySchema.parse({ ...req.body });
    const itinerary = await this.itineraryService.update(itineraryId, data);
    res.status(201).json(itinerary);
  };
}
