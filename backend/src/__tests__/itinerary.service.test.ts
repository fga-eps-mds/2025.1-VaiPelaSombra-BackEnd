import { ItineraryService } from '../services/itinerary.service';
import { ItineraryStatus } from '../generated/prisma';
import { prisma } from '../data/prismaClient';
import { Decimal } from '../generated/prisma/runtime/library';

jest.mock('../data/prismaClient', () => ({
  prisma: {
    itinerary: {
      create: jest.fn(),
    },
  },
}));

const mockItinerary = {
  id: 1,
  title: 'Trip to Test',
  startDate: new Date('2025-01-01'),
  endDate: new Date('2025-01-10'),
  itineraryStatus: ItineraryStatus.PLANNING,
  foodBudget: new Decimal(100),
  lodgingBudget: new Decimal(200),
  totalBudget: new Decimal(300),
  createdById: 1,
};

describe('ItineraryService.create', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return an itinerary', async () => {
    (prisma.itinerary.create as jest.Mock).mockResolvedValue(mockItinerary);

    const service = new ItineraryService();
    const data = {
      title: 'Trip to Test',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-10'),
      itineraryStatus: ItineraryStatus.PLANNING,
      foodBudget: 100,
      lodgingBudget: 200,
      totalBudget: 300,
    };

    const result = await service.create(1, data as any);

    expect(prisma.itinerary.create).toHaveBeenCalled();
    expect(result).toEqual(mockItinerary);
  });

  it('should include all unique userIds (including creator) when creating an itinerary', async () => {
    (prisma.itinerary.create as jest.Mock).mockResolvedValue(mockItinerary);

    const service = new ItineraryService();
    const data = {
      title: 'Trip to Test',
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-01-10'),
      itineraryStatus: ItineraryStatus.PLANNING,
      foodBudget: 100,
      lodgingBudget: 200,
      totalBudget: 300,
      usersIds: [2, 3, 1, 2],
    };

    await service.create(1, data as any);

    expect(prisma.itinerary.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        users: {
          connect: expect.arrayContaining([{ id: 1 }, { id: 2 }, { id: 3 }]),
        },
      }),
    });
  });
});
