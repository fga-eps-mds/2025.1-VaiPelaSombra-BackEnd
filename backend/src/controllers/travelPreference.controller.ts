import { Request, Response } from 'express';
import { TravelPreferenceService } from '../services/travelPreference.service';
import { PrismaTravelPreferenceRepository } from '../repositories/travelPreference/travelPreference.repository.prisma';
const travelPreferenceRepository = new PrismaTravelPreferenceRepository();
const travelPreferenceService = new TravelPreferenceService(travelPreferenceRepository);

export const createTravelPreference = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const { travelInterestIds } = req.body;

  const data = {
    travelInterests: {
      connect: travelInterestIds?.map((id: number) => ({ id })) || [],
    },
    user: {
      connect: {
        id: id,
      },
    },
  };
  const travelPreference = await travelPreferenceService.create(id, data);
  res.status(201).json(travelPreference);
};
export const getTravelPreferenceByUserId = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const travelPreference = await travelPreferenceService.findByUserId(id);
  res.status(200).json(travelPreference);
  return;
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

export const updateTravelPreference = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  const { travelInterestIds } = req.body;

  const data = {
    travelInterests: {
      set: travelInterestIds?.map((id: number) => ({ id })) || [],
    },
    user: {
      connect: {
        id: id,
      },
    },
  };
  const travelPreference = await travelPreferenceService.update(id, data);
  res.status(201).json(travelPreference);
};
