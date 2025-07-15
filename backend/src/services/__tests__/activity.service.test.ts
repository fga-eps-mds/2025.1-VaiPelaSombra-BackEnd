import { ActivityService } from '../activity.service';
import { prisma } from '../../data/prismaClient';
import { ConflictError, BadRequestError, NotFoundError } from '../../errors/httpError';
import { CreateActivityDTO } from '../../dtos/activity.dto';
import { Decimal } from '@prisma/client/runtime/library'; // importante

jest.mock('../../data/prismaClient', () => ({
  prisma: {
    activity: {
      create: jest.fn(),
      delete: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

const service = new ActivityService();

const baseData: CreateActivityDTO = {
  itineraryId: 1,
  title: 'Visit museum',
  location: 'Downtown',
  price: 50,
  startTime: new Date('2025-07-20T10:00:00Z'),
  endTime: new Date('2025-07-20T12:00:00Z'),
  destination: 1,
};

const mockActivity = {
  id: 1,
  itineraryId: 1,
  title: 'Visit museum',
  location: 'Downtown',
  price: new Decimal(50),
  startTime: new Date('2025-07-20T10:00:00Z'),
  endTime: new Date('2025-07-20T12:00:00Z'),
  destinationId: 1,
  duration: '02:00',
  description: null,
};

describe('ActivityService', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('create', () => {
    it('should throw BadRequestError if startTime >= endTime', async () => {
      await expect(
        service.create({
          ...baseData,
          startTime: new Date('2025-07-20T12:00:00Z'),
          endTime: new Date('2025-07-20T10:00:00Z'),
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw ConflictError if conflicting activities are found', async () => {
      jest.spyOn(service, 'findConflictingActivities').mockResolvedValue([mockActivity]);
      await expect(service.create(baseData)).rejects.toThrow(ConflictError);
    });

    it('should create activity if no conflicts', async () => {
      jest.spyOn(service, 'findConflictingActivities').mockResolvedValue([]);
      (prisma.activity.create as jest.Mock).mockResolvedValue(mockActivity);

      const result = await service.create(baseData);
      expect(prisma.activity.create).toHaveBeenCalled();
      expect(result.id).toBe(1);
    });
  });

  describe('delete', () => {
    it('should call prisma.activity.delete', async () => {
      (prisma.activity.delete as jest.Mock).mockResolvedValue(mockActivity);

      const result = await service.delete(1);
      expect(prisma.activity.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(mockActivity);
    });
  });

  describe('update', () => {
    it('should throw NotFoundError if activity not found', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.update(1, 1, { title: 'Updated' })).rejects.toThrow(NotFoundError);
    });

    it('should throw BadRequestError if time is invalid', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      await expect(
        service.update(1, 1, {
          startTime: new Date('2025-07-20T13:00:00Z'),
          endTime: new Date('2025-07-20T11:00:00Z'),
        })
      ).rejects.toThrow(BadRequestError);
    });

    it('should throw ConflictError if other conflicting activities found', async () => {
      const otherActivity = { ...mockActivity, id: 2 };
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      jest.spyOn(service, 'findConflictingActivities').mockResolvedValue([otherActivity]);

      await expect(service.update(1, 1, { title: 'Conflicting' })).rejects.toThrow(ConflictError);
    });

    it('should update activity if valid and no conflicts', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);
      jest.spyOn(service, 'findConflictingActivities').mockResolvedValue([mockActivity]);
      (prisma.activity.update as jest.Mock).mockResolvedValue({
        ...mockActivity,
        title: 'Updated',
      });

      const result = await service.update(1, 1, { title: 'Updated' });

      expect(prisma.activity.update).toHaveBeenCalled();
      expect(result?.title).toBe('Updated');
    });
  });

  describe('findAllOrderedByDate', () => {
    it('should return activities ordered by startTime', async () => {
      (prisma.activity.findMany as jest.Mock).mockResolvedValue([mockActivity]);
      const result = await service.findAllOrderedByDate(1, 1);
      expect(prisma.activity.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockActivity]);
    });
  });

  describe('findById', () => {
    it('should call prisma.activity.findUnique with correct id', async () => {
      (prisma.activity.findUnique as jest.Mock).mockResolvedValue(mockActivity);

      const result = await service.findById(1);
      expect(prisma.activity.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toBe(mockActivity);
    });
  });
});
