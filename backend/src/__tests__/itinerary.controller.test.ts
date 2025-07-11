import { ItineraryController } from '../controllers/itinerary.controller';
import { ItineraryService } from '../services/itinerary.service';
import { ItineraryStatus } from '@prisma/client';
import { Decimal } from '../generated/prisma/runtime/library';
import { Request, Response } from 'express';

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
  ownerId: 1,
};

const mockRequest = (params = {}, body = {}) =>
  ({
    params,
    body,
  }) as unknown as Request;

const mockResponse = (): Response => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('ItineraryController', () => {
  let mockItineraryService: jest.Mocked<ItineraryService>;
  let itineraryController: ItineraryController;

  beforeEach(() => {
    mockItineraryService = {
      create: jest.fn(),
      findByUserId: jest.fn(),
      findByUserItineraryId: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      addUserToItinerary: jest.fn(),
      getOwnerId: jest.fn(),
    } as unknown as jest.Mocked<ItineraryService>;

    itineraryController = new ItineraryController(mockItineraryService);
    jest.clearAllMocks();
  });

  describe('findByUserId', () => {
    it('should return itineraries for a user', async () => {
      const userId = 1;
      const expectedItineraries = [mockItinerary];

      mockItineraryService.findByUserId.mockResolvedValue(expectedItineraries);

      const req = mockRequest({ userId: String(userId) });
      const res = mockResponse();

      await itineraryController.findByUserId(req, res);

      expect(mockItineraryService.findByUserId).toHaveBeenCalledWith(userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expectedItineraries);
    });
  });
});
