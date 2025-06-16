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
  userId: number;
  travelerType: TravelerType;
  travelFrequency: TravelFrequency;
  averageBudget: number;
  prefer: PreferModel[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
  profileBio: string | null;
  profileImage: string | null;
  travelPreferences?: TravelPreferencesModel | null;
}
export interface UserPreferencesDataInput {
  name?: string;
  profileBio?: string | null;
  profileImage?: string | null;
}
