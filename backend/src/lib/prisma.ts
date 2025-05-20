import { PrismaClient, Prisma } from '../generated/prisma';

declare global {
  // Extend the global namespace to include the prisma instance
  interface Global {
    prisma?: PrismaClient;
  }
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma, Prisma };