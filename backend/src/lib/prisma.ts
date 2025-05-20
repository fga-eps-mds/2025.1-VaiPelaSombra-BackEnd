import { PrismaClient, Prisma } from '../generated/prisma';

// Declaração global para evitar conflitos de tipo
declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = globalThis.prisma || new PrismaClient({});

if (process.env.NODE_ENV === 'development') {
  globalThis.prisma = prisma; // Reutiliza a instância no ambiente de desenvolvimento
}

export { prisma, Prisma };
