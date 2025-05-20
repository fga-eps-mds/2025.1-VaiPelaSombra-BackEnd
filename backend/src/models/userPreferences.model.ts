export type TipoViajante = 'AVENTUREIRO' | 'CULTURAL' | 'RELAXAMENTO' | 'GASTRONOMICO';

export type FrequenciaViagem = 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface UserPreferencesInput {
  userId: number; // corresponde ao campo userId no Prisma
  travelerType: TipoViajante;
  travelFrequency: FrequenciaViagem;
  averageBudget: number;
  travelInterestsIds: number[]; // IDs dos interesses
}

export interface UserPreferences {
  userId: number;
  travelerType: TipoViajante;
  travelFrequency: FrequenciaViagem;
  averageBudget: number;
  travelInterests: {
    id: number;
    name: string;
  }[];
}
