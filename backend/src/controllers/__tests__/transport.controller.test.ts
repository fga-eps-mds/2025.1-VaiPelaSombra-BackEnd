import { Request, Response, NextFunction } from 'express';
import { TransportController } from '../../controllers/transport.controller';
import { TransportService } from '../../services/transport.service';
import { BadRequestError, NotFoundError } from '../../errors/httpError';
import { Decimal } from 'decimal.js'; 

jest.mock('../../dtos/transport.dto', () => ({
  CreateTransportSchema: {
    parse: (data: any) => data,
  },
  UpdateTransportSchema: {
    parse: (data: any) => data,
  },
}));

describe('TransportController', () => {
  let controller: TransportController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let mockService: jest.Mocked<TransportService>;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      end: jest.fn(),
    };
    next = jest.fn();

    mockService = {
      createTransport: jest.fn(),
      updateTransport: jest.fn(),
      getTransportById: jest.fn(),
      getAllTransports: jest.fn(),
      deleteTransport: jest.fn(),
    } as unknown as jest.Mocked<TransportService>;

    controller = new TransportController();
    controller.service = mockService;

    jest.clearAllMocks();
  });

  describe('createTransport', () => {
    it('should create transport successfully', async () => {
      const data = { type: 'BUS', departureTime: '10:00' };
      req.body = data;

      const created = {
        id: 1,
        type: 'BUS',
        cost: new Decimal(100),
        itineraryId: 1,
        departure: new Date('2025-07-20T08:00:00Z'),
        arrival: new Date('2025-07-20T10:00:00Z'),
        duration: '02:00',
        description: 'Express Bus',
      };
      mockService.createTransport.mockResolvedValue(created);

      await controller.createTransport(req as Request, res as Response, next);

      expect(mockService.createTransport).toHaveBeenCalledWith(data);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(created);
    });
  });

  describe('updateTransport', () => {
    it('should update transport successfully', async () => {
      req.params = { id: '1' };
      req.body = { type: 'PLANE' };

      const updated = {
        id: 1,
        type: 'PLANE',
        cost: new Decimal(200),
        itineraryId: 2,
        departure: new Date(),
        arrival: new Date(),
        duration: '03:00',
        description: 'Updated transport',
      };
      mockService.updateTransport.mockResolvedValue(updated);

      await controller.updateTransport(req as Request, res as Response, next);

      expect(mockService.updateTransport).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should return BadRequestError if id is invalid', async () => {
      req.params = { id: 'abc' };

      await controller.updateTransport(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should return NotFoundError if transport does not exist', async () => {
      req.params = { id: '1' };
      req.body = {};
      mockService.updateTransport.mockResolvedValue(null as any);

      await controller.updateTransport(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('getTransportById', () => {
    it('should return transport by id', async () => {
      req.params = { id: '1' };
      const found = {
        id: 1,
        type: 'TRAIN',
        cost: new Decimal(150),
        itineraryId: 3,
        departure: new Date(),
        arrival: new Date(),
        duration: '01:30',
        description: 'Fast train',
      };
      mockService.getTransportById.mockResolvedValue(found);

      await controller.getTransportById(req as Request, res as Response, next);

      expect(mockService.getTransportById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(found);
    });

    it('should return BadRequestError for invalid id', async () => {
      req.params = { id: 'invalid' };

      await controller.getTransportById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should return NotFoundError if not found', async () => {
      req.params = { id: '1' };
      mockService.getTransportById.mockResolvedValue(null as any);

      await controller.getTransportById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('getAllTransports', () => {
    it('should return all transports', async () => {
      const transports = [
        {
          id: 1,
          type: 'BUS',
          cost: new Decimal(90),
          itineraryId: 1,
          departure: new Date(),
          arrival: new Date(),
          duration: '02:00',
          description: 'City bus',
        },
        {
          id: 2,
          type: 'CAR',
          cost: new Decimal(50),
          itineraryId: 2,
          departure: new Date(),
          arrival: new Date(),
          duration: '01:00',
          description: 'Private car',
        },
      ];
      mockService.getAllTransports.mockResolvedValue(transports);

      await controller.getAllTransports({} as Request, res as Response, next);

      expect(mockService.getAllTransports).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(transports);
    });
  });

  describe('deleteTransport', () => {
    it('should delete transport successfully', async () => {
      req.params = { id: '1' };
      mockService.deleteTransport.mockResolvedValue(true as any);

      await controller.deleteTransport(req as Request, res as Response, next);

      expect(mockService.deleteTransport).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.end).toHaveBeenCalled();
    });

    it('should return BadRequestError for invalid id', async () => {
      req.params = { id: 'xyz' };

      await controller.deleteTransport(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should return NotFoundError if not deleted', async () => {
      req.params = { id: '1' };
      mockService.deleteTransport.mockResolvedValue(null as any);

      await controller.deleteTransport(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });
});
