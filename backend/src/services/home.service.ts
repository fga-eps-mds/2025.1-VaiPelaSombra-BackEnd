import { prisma } from '../data/prismaClient';

export class HomeService {
  async findDestinations(search?: string) {
    let whereClause = {};

    if (search) {
      whereClause = {
        name: {
          contains: search,
          mode: 'insensitive',
        },
      };
    }

    const destinations = await prisma.homeDestination.findMany({
      where: whereClause,
      include: {
        images: true,
      },
    });

    return destinations;
  }

  async getDestinationById(id: string) {
    const destination = await prisma.homeDestination.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    return destination;
  }
}
