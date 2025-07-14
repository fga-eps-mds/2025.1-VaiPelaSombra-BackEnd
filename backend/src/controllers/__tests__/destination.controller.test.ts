import { DestinationService } from '../../services/destination.service';
import { Request, Response } from 'express';
import { Decimal } from '@prisma/client/runtime/library';
import { BadRequestError, NotFoundError } from '../../errors/httpError';
import { destinationImageSchema } from '../../dtos/destinationImage.dto';
import { CreateDestinationSchema, UpdateDestinationSchema } from '../../dtos/destination.dto';
import { validateMIMEType } from 'validate-image-type';
import { ZodError } from 'zod';
import { DestinationController } from '../destination.controller';

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
  let destinationController: DestinationController;
  let req: Partial<Request>;
  let res: Partial<Response>;

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

    destinationController = new DestinationController(mockDestinationService);

    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('getAllDestinations', () => {
    it('should return all destinations with status 200', async () => {
      const mockDestinations = [
        {
          id: 1,
          title: 'Test Destination',
          locationName: 'A test location',
          description: 'A test destination',
          longitude: new Decimal(0),
          latitude: new Decimal(0),
          localClimate: null,
          timeZone: null,
        },
      ];
      mockDestinationService.getAllDestinations.mockResolvedValue(mockDestinations);

      await destinationController.getAllDestinations(req as Request, res as Response);

      expect(mockDestinationService.getAllDestinations).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestinations);
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it('should return empty array with status 200 if there are no destinations', async () => {
      mockDestinationService.getAllDestinations.mockResolvedValue([]);

      await destinationController.getAllDestinations(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });

  describe('getDestinationById', () => {
    it('should return destination by id with status 200', async () => {
      const mockDestination = {
        id: 1,
        title: 'Test Destination',
        locationName: 'A test location',
        description: 'A test destination',
        longitude: new Decimal(0),
        latitude: new Decimal(0),
        localClimate: null,
        timeZone: null,
      };
      req.params = { destinationId: '1' };
      mockDestinationService.getDestinationById.mockResolvedValue(mockDestination);

      await destinationController.getDestinationById(req as Request, res as Response);

      expect(mockDestinationService.getDestinationById).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestination);
    });

    it('should throw NotFoundError if destination not found', async () => {
      req.params = { destinationId: '1' };
      mockDestinationService.getDestinationById.mockResolvedValue(null);

      await expect(
        destinationController.getDestinationById(req as Request, res as Response)
      ).rejects.toThrow(new NotFoundError('Destination not found'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await expect(
        destinationController.getDestinationById(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId param is missing', async () => {
      req.params = {};

      await expect(
        destinationController.getDestinationById(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId is not positive', async () => {
      req.params = { destinationId: '-5' };

      await expect(
        destinationController.getDestinationById(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('createDestination', () => {
    it('should create a new destination and return it with status 201', async () => {
      const mockDestination = {
        id: 1,
        title: 'New Destination',
        locationName: 'A new location',
        description: 'A new destination',
        longitude: new Decimal(0),
        latitude: new Decimal(0),
        localClimate: null,
        timeZone: null,
      };
      req.body = {
        title: 'New Destination',
        locationName: 'A new location',
        description: 'A new destination',
        longitude: 0,
        latitude: 0,
      };
      (CreateDestinationSchema.parse as jest.Mock).mockReturnValue(req.body);
      mockDestinationService.create.mockResolvedValue(mockDestination);

      await destinationController.createDestination(req as Request, res as Response);

      expect(mockDestinationService.create).toHaveBeenCalledWith(req.body);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockDestination);
    });

    it('should throw ZodError if body validation fails', async () => {
      const zodError = new ZodError([{ path: ['title'], message: 'Required', code: 'custom' }]);
      req.body = {};

      (CreateDestinationSchema.parse as jest.Mock).mockImplementation(() => {
        throw zodError;
      });
      await expect(
        destinationController.createDestination(req as Request, res as Response)
      ).rejects.toThrow(zodError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('updateDestination', () => {
    it('should update a destination and return it with status 200', async () => {
      const mockDestination = {
        id: 1,
        title: 'Updated Destination',
        locationName: 'Updated location',
        description: 'Updated description',
        longitude: new Decimal(1),
        latitude: new Decimal(1),
        localClimate: null,
        timeZone: null,
      };
      req.params = { destinationId: '1' };
      req.body = {
        title: 'Updated Destination',
        locationName: 'Updated location',
        description: 'Updated description',
        longitude: 1,
        latitude: 1,
      };
      (UpdateDestinationSchema.parse as jest.Mock).mockReturnValue(req.body);

      mockDestinationService.update.mockResolvedValue(mockDestination);

      await destinationController.updateDestination(req as Request, res as Response);

      expect(mockDestinationService.update).toHaveBeenCalledWith(1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDestination);
    });

    it('should throw BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };
      req.body = {};

      await expect(
        destinationController.updateDestination(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId is zero or negative', async () => {
      req.params = { destinationId: '-1' };
      req.body = {};

      await expect(
        destinationController.updateDestination(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw ZodError if body validation fails', async () => {
      const zodError = new ZodError([{ path: ['title'], message: 'Required', code: 'custom' }]);
      req.params = { destinationId: '1' };
      req.body = {};

      (UpdateDestinationSchema.parse as jest.Mock).mockImplementation(() => {
        throw zodError;
      });

      await expect(
        destinationController.updateDestination(req as Request, res as Response)
      ).rejects.toThrow(zodError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });

  describe('deleteDestination', () => {
    it('should delete a destination and return it with status 200', async () => {
      const mockDeletedDestination = {
        id: 1,
        title: 'Deleted Destination',
        locationName: 'A deleted location',
        description: 'A deleted destination',
        longitude: new Decimal(0),
        latitude: new Decimal(0),
        localClimate: null,
        timeZone: null,
      };
      req.params = { destinationId: '1' };
      mockDestinationService.deleteDestination.mockResolvedValue(mockDeletedDestination);

      await destinationController.deleteDestination(req as Request, res as Response);

      expect(mockDestinationService.deleteDestination).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockDeletedDestination);
    });

    it('should throw BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await expect(
        destinationController.deleteDestination(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId is not positive', async () => {
      req.params = { destinationId: '-1' };

      await expect(
        destinationController.deleteDestination(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw error if service throws', async () => {
      req.params = { destinationId: '1' };
      const error = new Error('Service error');
      mockDestinationService.deleteDestination.mockRejectedValue(error);

      await expect(
        destinationController.deleteDestination(req as Request, res as Response)
      ).rejects.toThrow(error);
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

      await destinationController.uploadDestinationImage(req as Request, res as Response);

      expect(mockDestinationService.uploadDestinationImage).toHaveBeenCalledWith(1, req.file);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockImage);
    });

    it('should throw BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await expect(
        destinationController.uploadDestinationImage(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId param is not positive', async () => {
      req.params = { destinationId: '-1' };

      await expect(
        destinationController.uploadDestinationImage(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw ZodError if image schema validation fails', async () => {
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

      await expect(
        destinationController.uploadDestinationImage(req as Request, res as Response)
      ).rejects.toThrow(zodError);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if image MIME Type is invalid', async () => {
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

      await expect(
        destinationController.uploadDestinationImage(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid image type. Only JPEG and PNG are allowed.'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if no image file is provided', async () => {
      req.params = { destinationId: '1' };
      req.file = undefined;

      await expect(
        destinationController.uploadDestinationImage(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('No image file provided'));
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

      await destinationController.getDestinationImages(req as Request, res as Response);

      expect(mockDestinationService.getDestinationImages).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockImages);
    });

    it('should throw BadRequestError if destinationId param is not a number', async () => {
      req.params = { destinationId: 'abc' };

      await expect(
        destinationController.getDestinationImages(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw BadRequestError if destinationId is not positive', async () => {
      req.params = { destinationId: '-1' };

      await expect(
        destinationController.getDestinationImages(req as Request, res as Response)
      ).rejects.toThrow(new BadRequestError('Invalid destination id'));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('should throw error if service throws', async () => {
      req.params = { destinationId: '1' };
      const error = new Error('Service error');
      mockDestinationService.getDestinationImages.mockRejectedValue(error);

      await expect(
        destinationController.getDestinationImages(req as Request, res as Response)
      ).rejects.toThrow(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
