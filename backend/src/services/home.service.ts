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
        images: {
          take: 1,
          select: {
            url: true,
          },
        },
      },
      orderBy: {
        title: 'asc',
      },
    });

    return destinations.map((dest) => ({
      id: dest.id,
      title: dest.title,
      imageUrl: dest.images[0]?.url || null,
    }));
  }

  async getDestinationById(id: number) {
    const destination = await prisma.destination.findUnique({
      where: { id },
      include: {
        images: {
          select: {
            id: true,
            url: true,
          },
        },
      },
    });

    return destination;
  }
}
