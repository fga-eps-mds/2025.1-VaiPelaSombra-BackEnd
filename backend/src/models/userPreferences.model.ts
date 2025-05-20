export type TipoViajante = 'AVENTUREIRO' | 'CULTURAL' | 'RELAXAMENTO' | 'GASTRONOMICO';

export type FrequenciaViagem = 'BIMESTRAL' | 'TRIMESTRAL' | 'SEMESTRAL' | 'ANUAL';

export interface UserPreferencesInput {
  idUsuario: number;
  preferenciasViagem: string;
  tipoViajante: TipoViajante;
  frequenciaViagem: FrequenciaViagem;
  orcamentoMedio: number;
  interesses: string[];
}

export interface UserPreferences {
  idUsuario: number;
  preferenciasViagem: string;
  tipoViajante: TipoViajante;
  frequenciaViagem: FrequenciaViagem;
  orcamentoMedio: number;
  interesses: {
    idInteresse: number;
    nomeInteresse: string;
  }[];
}
