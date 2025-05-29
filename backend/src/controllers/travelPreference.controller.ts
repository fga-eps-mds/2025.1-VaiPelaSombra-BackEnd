import { Request, Response } from 'express';
import { TravelPreferenceService } from '../services/travelPreference.service';
import { PrismaTravelPreferenceRepository } from '../repositories/travelPreference/travelPreference.repository.prisma';
const travelPreferenceRepository = new PrismaTravelPreferenceRepository();
const travelPreferenceService = new TravelPreferenceService(travelPreferenceRepository);

export const createTravelPreference = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const data = req.body;

  try {
    const travelPreference = await travelPreferenceService.create(userId, data);
    res.status(201).json(travelPreference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const getTravelPreferenceByUserId = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const travelPreference = await travelPreferenceService.findByUserId(userId);
    if (!travelPreference) {
      res.status(404).json({ message: 'Travel preference not found' });
      return;
    }
    res.status(200).json(travelPreference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const updateTravelPreference = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);
  const data = req.body;

  try {
    const updatedTravelPreference = await travelPreferenceService.update(userId, data);
    if (!updatedTravelPreference) {
      res.status(404).json({ message: 'Travel preference not found' });
      return;
    }
    res.status(200).json(updatedTravelPreference);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
export const deleteTravelPreference = async (req: Request, res: Response) => {
  const userId = parseInt(req.params.userId);

  try {
    const deletedTravelPreference = await travelPreferenceService.delete(userId);
    if (!deletedTravelPreference) {
      res.status(404).json({ message: 'Travel preference not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
