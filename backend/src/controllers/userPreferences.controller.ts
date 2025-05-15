import { Request, Response } from 'express';
import { UserPreferencesService } from '../services/userPreferences.service';
export const UserPreferencesController = {
  getUserTravelPreferencesByUserId: async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.id);
      const userPreferences = await UserPreferencesService.getUserTravelPreferencesByUserId(userId);
      if (!userPreferences) {
        res.status(404).json({ message: "User's travel preferences not found or is empty" });
        return;
      }
      res.status(200).json(userPreferences);
    } catch (error) {
      res.status(500).json({
        message: "Error while fetching user's travel preferences",
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  },

  saveUserTravelPreferences: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const { travelPreferences } = req.body;

      const savedPreferences = await UserPreferencesService.saveUserTravelPreferences(
        id,
        travelPreferences
      );
      res.status(201).json(savedPreferences);
    } catch (error) {
      res.status(500).json({
        message: "Error while saving user's travel preferences",
        details: error instanceof Error ? error.message : String(error),
      });
      return;
    }
  },
};
