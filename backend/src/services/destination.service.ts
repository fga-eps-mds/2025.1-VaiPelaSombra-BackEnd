import { Destination, Prisma } from '@prisma/client';
import { prisma } from '../data/prismaClient';
import { CreateDestinationDTO, UpdateDestinationDTO } from '../dtos/destination.dto';
import { DestinationImageDTO } from '../dtos/destinationImage.dto';
export class DestinationService {
  async create(data: CreateDestinationDTO): Promise<Destination> {
    const prismaData: Prisma.DestinationCreateInput = {
      title: data.title,
      locationName: data.locationName,
      description: data.description,
      longitude: data.longitude,
      latitude: data.latitude,
      localClimate: data.localClimate,
      timeZone: data.timeZone,
      itineraries: {},
      reviews: {},
      localEvents: {},
      survivalTips: {},
      images: {},
    };

    return prisma.destination.create({
      data: {
        ...prismaData,
      },
    });
  }

  async deleteDestination(destinationId: number) {
    return prisma.destination.delete({
      where: {
        id: destinationId,
      },
    });
  }

  async update(destinationId: number, data: UpdateDestinationDTO): Promise<Destination> {
    const prismaData: Prisma.DestinationUpdateInput = {
      title: data.title,
      locationName: data.locationName,
      description: data.description,
      longitude: data.longitude,
      latitude: data.latitude,
      localClimate: data.localClimate,
      timeZone: data.timeZone,
    };

    return prisma.destination.update({
      where: {
        id: destinationId,
      },
      data: {
        ...prismaData,
      },
    });
  }

  async getAllDestinations() {
    return prisma.destination.findMany({
      orderBy: {
        title: 'asc',
      },
    });
  }
  async getDestinationById(destinationId: number): Promise<Destination | null> {
    return prisma.destination.findUnique({
      where: {
        id: destinationId,
      },
    });
  }
  async uploadDestinationImage(destinationId: number, file: DestinationImageDTO) {
    const imageUrl = `/uploads/${file.filename}`;

    const image = await prisma.destinationImage.create({
      data: {
        url: imageUrl,
        destinationId,
      },
    });

    return image;
  }
  async getDestinationImages(destinationId: number) {
    return prisma.destinationImage.findMany({
      where: { destinationId },
      select: { id: true, url: true },
      orderBy: { id: 'asc' },
    });
  }
}
