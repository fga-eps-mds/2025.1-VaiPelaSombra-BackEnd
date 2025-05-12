import { UserPreferencesInput } from '../models/userPreferences.model';
import { prisma } from '../data/prismaClient';

export const saveUserPreferences = async (data: UserPreferencesInput) => {
  const interessesRecords = await Promise.all(
    data.interesses.map(async (nomeInteresse) => {
      return prisma.interesseViagem.upsert({
        where: { nomeInteresse },
        update: {},
        create: { nomeInteresse },
      });
    })
  );

  const preferencias = await prisma.preferenciasViagem.upsert({
    where: { idUsuario: data.idUsuario },
    update: {
      preferenciasViagem: data.preferenciasViagem,
      tipoViajante: data.tipoViajante,
      frequenciaViagem: data.frequenciaViagem,
      orcamentoMedio: data.orcamentoMedio,
    },
    create: {
      idUsuario: data.idUsuario,
      preferenciasViagem: data.preferenciasViagem,
      tipoViajante: data.tipoViajante,
      frequenciaViagem: data.frequenciaViagem,
      orcamentoMedio: data.orcamentoMedio,
    },
  });

  await prisma.prefere.deleteMany({
    where: { idPreferencias: preferencias.idPreferencias },
  });

  await prisma.prefere.createMany({
    data: interessesRecords.map((interesse) => ({
      idPrerencias: preferencias.idPrerencias,
      idInteresse: interesse.idInteresse,
    })),
  });

  return preferencias;
};

export const getUserPreferences = async (idUsuario: number) => {
  const preferencias = await prisma.preferenciasViagem.findUnique({
    where: { idUsuario },
    include: {
      preferencias: {
        include: {
          interesse: true,
        },
      },
    },
  });

  if (!preferencias) return null;

  return {
    ...preferencias,
    interesses: preferencias.preferencias.map((p) => p.interesse),
  };
};
