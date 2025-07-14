import { ItineraryService } from '../../services/itinerary.service';
import { prisma } from '../../data/prismaClient';
import { BadRequestError } from '../../errors/httpError';
import { ItineraryStatus } from '@prisma/client'; // importa o enum correto

jest.mock('../../data/prismaClient', () => ({
  prisma: {
    itinerary: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('ItineraryService', () => {
  const service = new ItineraryService();

  const baseCreateDTO = {
    title: 'Test Trip',
    startDate: new Date(),
    endDate: new Date(),
    itineraryStatus: ItineraryStatus.PLANNING,
    foodBudget: 100,
    lodgingBudget: 200,
    totalBudget: 300,
    usersIds: [2, 3],
    transportIds: [1],
    activityIds: [2],
    destinationIds: [4],
    requiredDocumentIds: [5],
  };

  const baseUpdateDTO = {
    ...baseCreateDTO,
    title: 'Updated Trip',
  };

  it('should create itinerary', async () => {
    (prisma.itinerary.create as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await service.create(1, baseCreateDTO);
    expect(prisma.itinerary.create).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should update itinerary if user is owner', async () => {
    const updatedMock = { id: 1, ...baseUpdateDTO };
    jest.spyOn(service, 'getOwnerId').mockResolvedValue(1);
    (prisma.itinerary.update as jest.Mock).mockResolvedValue(updatedMock);

    const result = await service.update(1, 1, baseUpdateDTO);
    expect(result?.title).toBe('Updated Trip');
  });

  it('should throw error if user is not owner on update', async () => {
    jest.spyOn(service, 'getOwnerId').mockResolvedValue(999);

    await expect(service.update(1, 1, baseCreateDTO)).rejects.toThrow(BadRequestError);
  });

  it('should delete itinerary if user is owner', async () => {
    jest.spyOn(service, 'getOwnerId').mockResolvedValue(1);
    (prisma.itinerary.delete as jest.Mock).mockResolvedValue({ id: 1 });

    const result = await service.delete(1, 1);
    expect(prisma.itinerary.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result?.id).toBe(1);
  });
});
