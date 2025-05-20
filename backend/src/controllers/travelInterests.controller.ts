import { Request, Response } from 'express';
import { TravelInterestsService } from '../services/travelInterests.service';

export const TravelInterestsController = {
  async getAllTravelInterests(req: Request, res: Response) {
    try {
      const interests = await TravelInterestsService.getAllTravelInterests();
      res.status(200).json(interests);
    } catch (error) {
      res.status(500).json({
        message: 'Error while fetching travel interests',
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  },
  getUserTravelInterestsByUserId: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const userInterests = await TravelInterestsService.getUserTravelInterestsByUserId(id);
      if (!userInterests) {
        res.status(404).json({ message: "User's travel interests not found or is empty" });
        return;
      }
      res.status(200).json(userInterests);
    } catch (error) {
      res.status(500).json({
        message: "Error while fetching user's travel interests",
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  },

  saveUserTravelInterests: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { travelInterestsIds } = req.body;
      if (travelInterestsIds.length === 0) {
        res.status(400).json({ message: 'No travel interests provided' });
        return;
      }
      const savedInterests = await TravelInterestsService.saveUserTravelInterests(
        id,
        travelInterestsIds
      );
      res.status(201).json(savedInterests);
    } catch (error) {
      res.status(500).json({
        message: "Error while saving user's travel interests",
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  },
};
