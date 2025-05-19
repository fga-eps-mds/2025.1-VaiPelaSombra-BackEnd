export interface PlanoViagem {
  id: number;
  userId: number;
  nome: string;
  destino?: string | null;
  dataInicio?: Date | null;
  dataFim?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}