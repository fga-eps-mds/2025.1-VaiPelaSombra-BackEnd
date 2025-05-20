import { PrismaClient, Prisma } from '../generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient({
});

if (process.env.NODE_ENV === 'development') {
  global.prisma = prisma;
}

export { prisma, Prisma };