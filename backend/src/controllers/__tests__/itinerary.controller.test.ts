import { Request, Response } from 'express';
import { ItineraryController } from '../itinerary.controller';
import { ItineraryService } from '../../services/itinerary.service';
import { BadRequestError } from '../../errors/httpError';
import { AuthRequest } from '../../middlewares/auth.middleware';
jest.mock('../../services/itinerary.service');

describe('ItineraryController', () => {
  let itineraryController: ItineraryController;
  let mockItineraryService: jest.Mocked<ItineraryService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockAuthRequest: Partial<AuthRequest>;

  beforeEach(() => {
    mockItineraryService = new ItineraryService() as jest.Mocked<ItineraryService>;
    itineraryController = new ItineraryController(mockItineraryService);

    jest.clearAllMocks();

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('createItinerary', () => {
    it('should create an itinerary successfully', async () => {
      const userId = 1;
      const mockItineraryData = {
        title: 'Test Itinerary',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-10'),
        itineraryStatus: 'PLANNING' as const,
        foodBudget: 500,
        lodgingBudget: 1000,
      };

      const expectedItinerary = {
        id: 1,
        ...mockItineraryData,
        totalBudget: 1500,
        ownerId: userId,
      };

      mockRequest = {
        params: { userId: userId.toString() },
        body: mockItineraryData,
      };

      mockItineraryService.create = jest.fn().mockResolvedValue(expectedItinerary);

      await itineraryController.createItinerary(mockRequest as Request, mockResponse as Response);

      expect(mockItineraryService.create).toHaveBeenCalledWith(userId, mockItineraryData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedItinerary);
    });

    it('should throw BadRequestError for invalid user id', async () => {
      mockRequest = {
        params: { userId: 'invalid' },
        body: {
          title: 'Test Itinerary',
          startDate: new Date('2025-07-01'),
          endDate: new Date('2025-07-10'),
          itineraryStatus: 'PLANNING',
        },
      };

      await expect(
        itineraryController.createItinerary(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow(BadRequestError);

      expect(mockItineraryService.create).not.toHaveBeenCalled();
    });
  });
  describe('findByUserId', () => {
    it('should find itinerary by used id successfully', async () => {
      const userId = 1;

      const expectedItineraries = [
        {
          id: 1,
          title: 'Test Itinerary',
          startDate: new Date('2025-07-01'),
          endDate: new Date('2025-07-10'),
          itineraryStatus: 'PLANNING' as const,
          foodBudget: 500,
          lodgingBudget: 1000,
          totalBudget: 1500,
          ownerId: userId,
        },
      ];

      mockRequest = {
        params: {
          userId: userId.toString(),
        },
      };

      mockItineraryService.findByUserId = jest.fn().mockResolvedValue(expectedItineraries);

      await itineraryController.findByUserId(mockRequest as Request, mockResponse as Response);
      expect(mockItineraryService.findByUserId).toHaveBeenCalledWith(userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedItineraries);
    });
    it('should throw BadRequestError for invalid user id', async () => {
      mockRequest = {
        params: {
          userId: 'invalid',
        },
      };

      await expect(
        itineraryController.findByUserId(mockRequest as Request, mockResponse as Response)
      ).rejects.toThrow(BadRequestError);
    });
  });
  describe('deleteItinerary', () => {
    it('should delete a itinerary successfully', async () => {
      const userId = 1;
      const itineraryId = 1;
      const expectedDeletedItinerary = {
        id: itineraryId,
        title: 'Test Itinerary',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-10'),
        itineraryStatus: 'PLANNING' as const,
        foodBudget: 500,
        lodgingBudget: 1000,
        totalBudget: 1500,
        ownerId: userId,
      };
      mockAuthRequest = {
        params: { itineraryId: itineraryId.toString() },
        user: { id: userId, email: 'test@example.com', name: 'Rogerio' },
      };
      mockItineraryService.delete = jest.fn().mockResolvedValue(expectedDeletedItinerary);

      await itineraryController.deleteItinerary(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockItineraryService.delete).toHaveBeenCalledWith(itineraryId, userId);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedDeletedItinerary);
    });
    it('should throw BadRequestError for invalid itinerary id', async () => {
      mockAuthRequest = {
        params: { itineraryId: 'invalid' },
        user: { id: 1, email: 'test@example.com', name: 'Rogerio' },
      };
      await expect(
        itineraryController.deleteItinerary(
          mockAuthRequest as AuthRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(BadRequestError);
    });
  });
  describe('updateItinerary', () => {
    it('should update itinerary successfully', async () => {
      const userId = 1;
      const itineraryId = 1;
      const mockItineraryData = {
        title: 'Test Itinerary',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-10'),
        itineraryStatus: 'PLANNING' as const,
        foodBudget: 600,
        lodgingBudget: 1200,
      };

      const expectedItinerary = {
        id: itineraryId,
        ...mockItineraryData,
        totalBudget: 1800,
        ownerId: userId,
      };

      mockAuthRequest = {
        params: {
          itineraryId: itineraryId.toString(),
        },
        body: mockItineraryData,
        user: { id: userId, email: 'test@example.com', name: 'Rogerio' },
      };

      mockItineraryService.update = jest.fn().mockResolvedValue(expectedItinerary);

      await itineraryController.updateItinerary(
        mockAuthRequest as AuthRequest,
        mockResponse as Response
      );

      expect(mockItineraryService.update).toHaveBeenCalledWith(
        itineraryId,
        userId,
        mockItineraryData
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(expectedItinerary);
    });
    it('should throw BadRequestError for invalid itinerary id', async () => {
      mockAuthRequest = {
        params: { itineraryId: 'invalid' },
        user: { id: 1, email: 'test@example.com', name: 'Rogerio' },
      };
      await expect(
        itineraryController.updateItinerary(
          mockAuthRequest as AuthRequest,
          mockResponse as Response
        )
      ).rejects.toThrow(BadRequestError);
    });
  });
});
