import { DestinationService } from '../services/destination.service';
import { Request, Response, NextFunction } from 'express';
import { CreateDestinationSchema, UpdateDestinationSchema } from '../dtos/destination.dto';
import { BadRequestError } from '../errors/httpError';
const destinationService = new DestinationService();
export const createDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateDestinationSchema.parse(req.body);
    const destination = await destinationService.create(data);
    res.status(201).json(destination);
  } catch (error) {
    next(error);
  }
};
export const deleteDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId)) throw new BadRequestError('Invalid destination id');
    const deletedDestination = await destinationService.deleteDestination(destinationId);
    res.status(200).json(deletedDestination);
  } catch (error) {
    next(error);
  }
};
export const updateDestination = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId)) throw new BadRequestError('Invalid destination id');
    const data = UpdateDestinationSchema.parse(req.body);
    const updatedDestination = await destinationService.update(destinationId, data);
    res.status(200).json(updatedDestination);
  } catch (error) {
    next(error);
  }
};
export const getAllDestinations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinations = await destinationService.getAllDestinations();
    res.status(200).json(destinations);
  } catch (error) {
    next(error);
  }
};
export const getDestinationById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId)) throw new BadRequestError('Invalid destination id');
    const destination = await destinationService.getDestinationById(destinationId);
    if (!destination) {
      throw new BadRequestError('Destination not found');
    }
    res.status(200).json(destination);
  } catch (error) {
    next(error);
  }
};
