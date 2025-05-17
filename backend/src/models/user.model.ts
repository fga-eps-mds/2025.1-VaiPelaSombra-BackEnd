
import { TravelerType, TravelFrequency } from '../generated/prisma';

interface TravelInterestModel {
  id: number;
  name: string;
}

interface PreferModel {
  travelInterests: TravelInterestModel;
}

interface TravelPreferencesModel {
  id: number;
  userId: number; // This field is on the TravelPreferences model in Prisma
  travelerType: TravelerType; // Use the actual ENUM type
  travelFrequency: TravelFrequency; // Use the actual ENUM type
  averageBudget: number;
  prefer: PreferModel[]; // Array of Prefer join records
  // Add any other scalar fields from your TravelPreferences model
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string; // Often excluded from client responses
  createdAt: Date;
  profileBio: string | null;
  profileImage: string | null;
  travelPreferences?: TravelPreferencesModel | null; // Correctly typed
}
