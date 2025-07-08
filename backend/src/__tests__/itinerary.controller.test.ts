import { createItinerary } from '../controllers/itinerary.controller';
import { ItineraryService } from '../services/itinerary.service';
import { ItineraryStatus } from '../generated/prisma';
import { Decimal } from '../generated/prisma/runtime/library';

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

const mockRequest = (params = {}, body = {}) => ({ params, body }) as any;
const mockResponse = () => {
  const res = {} as any;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const next = jest.fn();

describe('createItinerary (controller original)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 201 and created itinerary', async () => {
    // Aqui é onde você intercepta o método real
    jest.spyOn(ItineraryService.prototype, 'create').mockResolvedValue(mockItinerary);

    const req = mockRequest(
      { userId: '1' },
      {
        title: 'Trip to Test',
        startDate: new Date('2025-01-01'),
        endDate: new Date('2025-01-10'),
        itineraryStatus: ItineraryStatus.PLANNING,
        foodBudget: 100,
        lodgingBudget: 200,
      }
    );

    const res = mockResponse();

    await createItinerary(req, res, next);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockItinerary);
  });
});
