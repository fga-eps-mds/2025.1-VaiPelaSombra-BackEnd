import { prisma } from '../data/prismaClient';
import { PlanoViagem } from '../models/planoViagem.model';

export const PlanoViagemService = {
  getAllPlanosViagemByUserId: async (userId: number): Promise<PlanoViagem[]> => {
    return await prisma.planoViagem.findMany({
      where: { userId },
    });
  },

  getPlanoViagemById: async (userId: number, id: number): Promise<PlanoViagem | null> => {
    return await prisma.planoViagem.findFirst({
      where: { userId, id },
    });
  },

  createPlanoViagem: async (
    userId: number,
    newPlano: Omit<PlanoViagem, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<PlanoViagem> => {
    return await prisma.planoViagem.create({
      data: {
        ...newPlano,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
  },

  deletePlanoViagem: async (userId: number, id: number): Promise<boolean> => {
    const deleted = await prisma.planoViagem.deleteMany({
      where: { userId, id },
    });
    return deleted.count > 0;
  },

  updatePlanoViagem: async (
    userId: number,
    id: number,
    updatedData: Partial<Omit<PlanoViagem, 'id' | 'userId' | 'createdAt'>>
  ): Promise<PlanoViagem | null> => {
    const updated = await prisma.planoViagem.updateMany({
      where: { userId, id },
      data: {
        ...updatedData,
        updatedAt: new Date(),
      },
    });

    if (updated.count === 0) return null;

    return await prisma.planoViagem.findFirst({
      where: { userId, id },
    });
  },
};
