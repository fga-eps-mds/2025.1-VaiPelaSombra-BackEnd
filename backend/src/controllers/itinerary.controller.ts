import { Request, Response } from 'express';
import { PrismaItineraryRepository } from '../repositories/itinerary/itinerary.reposity.prisma';
import { ItineraryService } from '../services/itinerary.service';

const itineraryRepository = new PrismaItineraryRepository();
const itineraryService = new ItineraryService(itineraryRepository);
export const createItinerary = async (req: Request, res: Response) => {
  const {
    title,
    startDate,
    endDate,
    itineraryStatus,
    foodBudget,
    lodgingBudget,
    totalBudget,
    userIds,
    activityIds,
    destinationIds,
    transportIds,
    requiredDocumentIds,
  } = req.body;

  const data = {
    title,
    startDate,
    endDate,
    itineraryStatus,
    foodBudget,
    lodgingBudget,
    totalBudget,
    users: {
      connect: userIds.map((id) => ({ id })),
    },
    transports: {
      connect: transportIds?.map((id) => ({ id })) || [],
    },
    activities: {
      connect: activityIds?.map((id) => ({ id })) || [],
    },
    destinations: {
      connect: destinationIds?.map((id) => ({ id })) || [],
    },
    requiredDocuments: {
      connect: requiredDocumentIds?.map((id) => ({ id })) || [],
    },
  };

  const itinerary = await itineraryService.create(data);
  res.status(201).json(itinerary);
};

export const findByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.id);

  const itinearies = await itineraryService.findByUserId(userId);
  res.status(200).json(itinearies);
};

// TODO: Allow deletion only by the user that created the itinerary
export const deleteItinerary = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const deletedItinerary = await itineraryService.delete(id);
  res.status(200).json(deletedItinerary);
};

export const updateItinerary = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const {
    title,
    startDate,
    endDate,
    itineraryStatus,
    foodBudget,
    lodgingBudget,
    totalBudget,
    userIds,
    activityIds,
    destinationIds,
    transportIds,
    requiredDocumentIds,
  } = req.body;

  const data = {
    title,
    startDate,
    endDate,
    itineraryStatus,
    foodBudget,
    lodgingBudget,
    totalBudget,
    users: {
      connect: userIds.map((id) => ({ id })),
    },
    transports: {
      connect: transportIds?.map((id) => ({ id })) || [],
    },
    activities: {
      connect: activityIds?.map((id) => ({ id })) || [],
    },
    destinations: {
      connect: destinationIds?.map((id) => ({ id })) || [],
    },
    requiredDocuments: {
      connect: requiredDocumentIds?.map((id) => ({ id })) || [],
    },
  };

  const itinerary = await itineraryService.update(id, data);
  res.status(201).json(itinerary);
};
