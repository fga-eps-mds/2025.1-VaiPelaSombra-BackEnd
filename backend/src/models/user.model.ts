// backend/src/models/user.model.ts

// Import enums from your generated Prisma client
// Adjust the path if your 'generated' folder is elsewhere relative to 'models'
import { TravelerType, TravelFrequency } from '../generated/prisma';

interface TravelInterestModel {
  id: number;
  name: string;
  // Add any other fields from your TravelInterests model if you include them
}

interface PreferModel {
  // travelPreferencesId: number; // Scalar from Prefer model
  // travelInterestsId: number;   // Scalar from Prefer model
  travelInterests: TravelInterestModel; // The included TravelInterests object
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