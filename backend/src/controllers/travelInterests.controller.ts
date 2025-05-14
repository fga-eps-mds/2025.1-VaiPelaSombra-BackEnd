import { Request, Response } from 'express';

import { travelInterestsService } from '../services/travelInterests.service';

export const travelInterestsController = {
  async getAllTravelInterests(req: Request, res: Response) {
    try {
      const interests = await travelInterestsService.getAllTravelInterests();
      res.status(200).json(interests);
    } catch (error) {
      res.status(500).json(error);
      return;
    }
  },
};
