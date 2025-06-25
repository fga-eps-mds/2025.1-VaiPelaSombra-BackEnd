import { prisma } from '../data/prismaClient';

export class HomeService {
  async findDestinations(search?: string) {
    let whereClause = {};

    if (search && search.trim()) {
      whereClause = {
        title: {
          contains: search.trim(),
          mode: 'insensitive',
        },
      };
    }

    const destinations = await prisma.destination.findMany({
      where: whereClause,
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        title: 'asc',
      },
    });

    return destinations;
  }

  async getDestinationById(id: number) {
    const destination = await prisma.destination.findUnique({
      where: { id },
    });

    return destination;
  }
}
