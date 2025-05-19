import { PlanoViagem } from '../models/planoViagem.model';

let planosViagem: PlanoViagem[] = [
  {
    id: 1,
    userId: 1,
    nome: 'Viagem para o Caribe',
    destino: 'Caribe',
    dataInicio: new Date('2025-06-01'),
    dataFim: new Date('2025-06-15'),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const PlanoViagemService = {
  getAllPlanosViagemByUserId: (userId: number): PlanoViagem[] => {
    return planosViagem.filter((plano) => plano.userId === userId);
  },

  getPlanoViagemById: (userId: number, id: number): PlanoViagem | undefined => {
    return planosViagem.find((plano) => plano.userId === userId && plano.id === id);
  },

  createPlanoViagem: (userId: number, newPlano: Omit<PlanoViagem, 'id' | 'createdAt' | 'updatedAt'>): PlanoViagem => {
    const newId = planosViagem.length > 0 ? planosViagem[planosViagem.length - 1].id + 1 : 1;
    const plano = {
      ...newPlano,
      id: newId,
      userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    planosViagem.push(plano);
    return plano;
  },

  deletePlanoViagem: (userId: number, id: number): boolean => {
    const index = planosViagem.findIndex((plano) => plano.userId === userId && plano.id === id);
    if (index === -1) return false;

    planosViagem.splice(index, 1);
    return true;
  },

  updatePlanoViagem: (userId: number, id: number, updatedData: Partial<PlanoViagem>): PlanoViagem | undefined => {
    const plano = planosViagem.find((plano) => plano.userId === userId && plano.id === id);
    if (!plano) return undefined;

    Object.assign(plano, updatedData, { updatedAt: new Date() });
    return plano;
  },
};