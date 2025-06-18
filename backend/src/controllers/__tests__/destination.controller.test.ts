import * as destinationController from '../destination.controller';
import { DestinationService } from '../../services/destination.service';
import { Request, Response } from 'express';
import { Decimal } from '../../generated/prisma/runtime/library';
import { BadRequestError, NotFoundError } from '../../errors/httpError';
import { destinationImageSchema } from '../../dtos/destinationImage.dto';
import { CreateDestinationSchema, UpdateDestinationSchema } from '../../dtos/destination.dto';
import { validateMIMEType } from 'validate-image-type';
import { ZodError } from 'zod';

jest.mock('../../dtos/destination.dto', () => ({
  CreateDestinationSchema: { parse: jest.fn() },
  UpdateDestinationSchema: { parse: jest.fn() },
}));
jest.mock('../../dtos/destinationImage.dto', () => ({
  destinationImageSchema: { parse: jest.fn() },
}));
jest.mock('validate-image-type', () => ({
  validateMIMEType: jest.fn(),
}));
describe('Destination Controller', () => {
  let mockDestinationService: jest.Mocked<DestinationService>;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;
  beforeEach(() => {
    jest.clearAllMocks();
    mockDestinationService = {
      getAllDestinations: jest.fn(),
      create: jest.fn(),
      deleteDestination: jest.fn(),
      update: jest.fn(),
      getDestinationById: jest.fn(),
      getDestinationByTitle: jest.fn(),
      getDestinationImages: jest.fn(),
      uploadDestinationImage: jest.fn(),
    } as jest.Mocked<DestinationService>;

    (destinationController as { destinationService: DestinationService }).destinationService =
      mockDestinationService;

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });
  describe('getAllDestinations', () => {
    it('should return all destinations with status 200', async () => {
      const mockDestinations = [
        {
          id: 1,
          title: 'Test Destination',
          description: 'A test destination',
          longitude: new Decimal(0),
          latitude: new Decimal(0),
          localClimate: null,
          timeZone: null,
        },
      ];
      mockDestinationService.getAllDestinations.mockResolvedValue(mockDestinations);

      await destinationController.getAllDestinations(req as Request, res as Response, next);

      expect(mockDestinationService.getAllDestinations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestinations);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should return empty array with status 200 if there are no destinations', async () => {
      mockDestinationService.getAllDestinations.mockResolvedValue([]);

      await destinationController.getAllDestinations(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with ZodError if body validation fails', async () => {
      const zodError = new ZodError([{ path: ['title'], message: 'Required', code: 'custom' }]);
      req.body = {};

      (CreateDestinationSchema.parse as jest.Mock).mockImplementation(() => {
        throw zodError;
      });
      await destinationController.createDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(zodError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it('should call next with error if service throws', async () => {
      const error = new Error('Service error');
      mockDestinationService.getAllDestinations.mockRejectedValue(error);
      await destinationController.getAllDestinations(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('getDestinationById', () => {
    it('should return destination by id with status 200', async () => {
      const mockDestination = {
        id: 1,
        title: 'Test Destination',
        description: 'A test destination',
        longitude: new Decimal(0),
        latitude: new Decimal(0),
        localClimate: null,
        timeZone: null,
      };
      req.params = { destinationId: '1' };
      mockDestinationService.getDestinationById.mockResolvedValue(mockDestination);

      await destinationController.getDestinationById(req as Request, res as Response, next);

      expect(mockDestinationService.getDestinationById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestination);
    });

    it('should call next with NotFoundError if destination not found', async () => {
      req.params = { destinationId: '1' };
      mockDestinationService.getDestinationById.mockResolvedValue(null);

      await destinationController.getDestinationById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(NotFoundError);
      expect(error.message).toBe('Destination not found');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await destinationController.getDestinationById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId param is missing', async () => {
      req.params = {};

      await destinationController.getDestinationById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledTimes(1);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId is not positive', async () => {
      req.params = { destinationId: '-5' };

      await destinationController.getDestinationById(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
  describe('createDestination', () => {
    it('should create a new destination and return it with status 201', async () => {
      const mockDestination = {
        id: 1,
        title: 'New Destination',
        description: 'A new destination',
        longitude: new Decimal(0),
        latitude: new Decimal(0),
        localClimate: null,
        timeZone: null,
      };
      req.body = {
        title: 'New Destination',
        description: 'A new destination',
        longitude: 0,
        latitude: 0,
      };
      (CreateDestinationSchema.parse as jest.Mock).mockReturnValue(req.body);
      mockDestinationService.create.mockResolvedValue(mockDestination);

      await destinationController.createDestination(req as Request, res as Response, next);

      expect(mockDestinationService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDestination);
    });
  });
  describe('updateDestination', () => {
    it('should update a destination and return it with status 200', async () => {
      const mockDestination = {
        id: 1,
        title: 'Updated Destination',
        description: 'Updated description',
        longitude: new Decimal(1),
        latitude: new Decimal(1),
        localClimate: null,
        timeZone: null,
      };
      req.params = { destinationId: '1' };
      req.body = {
        title: 'Updated Destination',
        description: 'Updated description',
        longitude: 1,
        latitude: 1,
      };
      (UpdateDestinationSchema.parse as jest.Mock).mockReturnValue(req.body);

      mockDestinationService.update.mockResolvedValue(mockDestination);

      await destinationController.updateDestination(req as Request, res as Response, next);

      expect(mockDestinationService.update).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestination);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };
      req.body = {};

      await destinationController.updateDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId is zero or negative', async () => {
      req.params = { destinationId: '-1' };
      req.body = {};

      await destinationController.updateDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should call next with error if service throws', async () => {
      req.params = { destinationId: '1' };
      req.body = {};
      const error = new Error('Service error');
      mockDestinationService.update.mockRejectedValue(error);

      await destinationController.updateDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it('should call next with ZodError if body validation fails (updateDestination)', async () => {
      const zodError = new ZodError([{ path: ['title'], message: 'Required', code: 'custom' }]);
      req.params = { destinationId: '1' };
      req.body = {};

      (UpdateDestinationSchema.parse as jest.Mock).mockImplementation(() => {
        throw zodError;
      });

      await destinationController.updateDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(zodError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('deleteDestination', () => {
    it('should delete a destination and return it with status 200', async () => {
      const mockDeletedDestination = {
        id: 1,
        title: 'Deleted Destination',
        description: 'A deleted destination',
        longitude: new Decimal(0),
        latitude: new Decimal(0),
        localClimate: null,
        timeZone: null,
      };
      req.params = { destinationId: '1' };
      mockDestinationService.deleteDestination.mockResolvedValue(mockDeletedDestination);

      await destinationController.deleteDestination(req as Request, res as Response, next);

      expect(mockDestinationService.deleteDestination).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedDestination);
    });

    it('should call next with BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await destinationController.deleteDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId is not positive', async () => {
      req.params = { destinationId: '-1' };

      await destinationController.deleteDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should call next with error if service throws', async () => {
      req.params = { destinationId: '1' };
      const error = new Error('Service error');
      mockDestinationService.deleteDestination.mockRejectedValue(error);

      await destinationController.deleteDestination(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('uploadDestinationImage', () => {
    it('should upload an image and return it with status 201', async () => {
      const mockImage = {
        id: 1,
        url: '/uploads/test.jpg',
        destinationId: 1,
        description: null,
      };
      req.params = { destinationId: '1' };
      req.file = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1234,
        destination: '/uploads',
        filename: 'test.jpg',
        path: '/uploads/test.jpg',
        buffer: Buffer.from(''),
        stream: {} as NodeJS.ReadableStream,
      } as Express.Multer.File;

      (destinationImageSchema.parse as jest.Mock).mockReturnValue(req.file);
      (validateMIMEType as jest.Mock).mockResolvedValue({ ok: true });

      mockDestinationService.uploadDestinationImage.mockResolvedValue(mockImage);

      await destinationController.uploadDestinationImage(req as Request, res as Response, next);

      expect(mockDestinationService.uploadDestinationImage).toHaveBeenCalledWith(1, req.file);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockImage);
      expect(next).not.toHaveBeenCalled();
    });
    it('should call next with BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await destinationController.uploadDestinationImage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it('should call next with BadRequestError if destinationId param is not positive', async () => {
      req.params = { destinationId: '-1' };

      await destinationController.uploadDestinationImage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it('should call next with ZodError if image schema validation fails', async () => {
      req.params = { destinationId: '1' };
      req.file = {
        fieldname: 'file',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 1234,
        destination: '/uploads',
        filename: 'test.jpg',
        path: '/uploads/test.jpg',
        buffer: Buffer.from(''),
        stream: {} as NodeJS.ReadableStream,
      } as Express.Multer.File;

      const zodError = new ZodError([
        { path: ['field'], message: 'Invalid field', code: 'custom' },
      ]);
      (destinationImageSchema.parse as jest.Mock).mockImplementation(() => {
        throw zodError;
      });

      await destinationController.uploadDestinationImage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(zodError);
    });
    it('should call next with BadRequestError if image MIME Type is invalid', async () => {
      req.params = { destinationId: '1' };
      req.file = {
        fieldname: 'file',
        originalname: 'test.txt',
        encoding: '7bit',
        mimetype: 'text/plain',
        size: 1234,
        destination: '/uploads',
        filename: 'test.txt',
        path: '/uploads/test.txt',
        buffer: Buffer.from(''),
        stream: {} as NodeJS.ReadableStream,
      } as Express.Multer.File;

      (destinationImageSchema.parse as jest.Mock).mockReturnValue(req.file);
      (validateMIMEType as jest.Mock).mockResolvedValue({ ok: false });

      await destinationController.uploadDestinationImage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid image type. Only JPEG and PNG are allowed.');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
    it('should call next with BadRequestError if no image file is provided', async () => {
      req.params = { destinationId: '1' };
      req.file = undefined;

      await destinationController.uploadDestinationImage(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('No image file provided');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
  describe('getDestinationImages', () => {
    it('should return images for a destination with status 200', async () => {
      const mockImages = [
        { id: 1, url: '/uploads/img1.jpg', destinationId: 1, description: null },
        { id: 2, url: '/uploads/img2.jpg', destinationId: 1, description: null },
      ];
      req.params = { destinationId: '1' };
      mockDestinationService.getDestinationImages.mockResolvedValue(mockImages);

      await destinationController.getDestinationImages(req as Request, res as Response, next);

      expect(mockDestinationService.getDestinationImages).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockImages);
      expect(next).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await destinationController.getDestinationImages(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(BadRequestError);
      expect(error.message).toBe('Invalid destination id');
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with BadRequestError if destinationId is not positive', async () => {
      req.params = { destinationId: '-1' };

      await destinationController.getDestinationImages(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should call next with error if service throws', async () => {
      req.params = { destinationId: '1' };
      const error = new Error('Service error');
      mockDestinationService.getDestinationImages.mockRejectedValue(error);

      await destinationController.getDestinationImages(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
