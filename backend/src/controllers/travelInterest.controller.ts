import { Request, Response } from 'express';
import { TravelInterestService } from '../services/travelInterest.service';
import { PrismaTravelInterestRepository } from '../repositories/travelInterest/travelInterest.repository.prisma';

const travelInterestRepository = new PrismaTravelInterestRepository();
const travelInterestService = new TravelInterestService(travelInterestRepository);

export const createTravelInterest = async (req: Request, res: Response) => {
  const { label } = req.body;

  const data = { label };
  const travelInterest = await travelInterestService.create(data);
  res.status(201).json(travelInterest);
  return;
};

export const updateTravelInterest = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const updatedTravelInterest = await travelInterestService.update(id, req.body);
  if (!updatedTravelInterest) {
    res.status(404).json({ message: 'Travel interest not found' });
    return;
  }
  res.status(200).json(updatedTravelInterest);
  return;
};

export const deleteTravelInterest = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const deleted = await travelInterestService.delete(id);
  if (!deleted) {
    res.status(404).json({ message: 'Travel interest not found' });
    return;
  }
  res.status(204).send();
  return;
};
export const getTravelInterests = async (req: Request, res: Response) => {
  const travelInterests = await travelInterestService.findAll();
  res.status(200).json(travelInterests);
  return;
};

export const getTravelInterestById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const travelInterest = await travelInterestService.findById(id);
  if (!travelInterest) {
    res.status(404).json({ message: 'Travel interest not found' });
    return;
  }
  res.status(200).json(travelInterest);
  return;
};
