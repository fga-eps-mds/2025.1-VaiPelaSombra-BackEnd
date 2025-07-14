import { Request, Response, NextFunction } from 'express';
import * as ActivityController from '../../controllers/activity.controller';
import { ActivityService } from '../../services/activity.service';
import { BadRequestError, NotFoundError } from '../../errors/httpError';

jest.mock('../../dtos/activity.dto', () => ({
  CreateActivitySchema: {
    parse: (data: any) => data,
  },
  UpdateActivitySchema: {
    parse: (data: any) => data,
  },
}));

const mockResponse = (): Partial<Response> => ({
  status: jest.fn().mockReturnThis(),
  json: jest.fn().mockReturnThis(),
  send: jest.fn().mockReturnThis(),
});

describe('ActivityController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = mockResponse();
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('createActivity', () => {
    it('should create an activity successfully', async () => {
      req.params = { itineraryId: '1' };
      req.body = {
        name: 'Activity A',
        location: 'Location X',
        title: 'Title X',
        price: null,
        startTime: new Date('2025-07-14T10:00:00Z'),
        endTime: new Date('2025-07-14T12:00:00Z'),
        duration: '02:00',
        description: null,
        destinationId: null,
      };

      const createdActivity = {
        id: 1,
        ...req.body,
        itineraryId: 1,
      };

      const createSpy = jest.spyOn(ActivityService.prototype, 'create').mockResolvedValue(createdActivity);

      await ActivityController.createActivity(req as Request, res as Response, next);

      expect(createSpy).toHaveBeenCalledWith({ ...req.body, itineraryId: 1 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(createdActivity);
    });

    it('should throw BadRequestError for invalid itineraryId', async () => {
      req.params = { itineraryId: 'abc' };
      await ActivityController.createActivity(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe('deleteActivity', () => {
    it('should delete activity successfully', async () => {
      req.params = { activityId: '2' };
      const deleted = {
        id: 2,
        name: 'Deleted',
        location: 'Location Y',
        title: 'Title Y',
        price: null,
        startTime: new Date(),
        endTime: new Date(),
        duration: '01:00',
        description: null,
        itineraryId: 1,
        destinationId: null,
      };

      const deleteSpy = jest.spyOn(ActivityService.prototype, 'delete').mockResolvedValue(deleted);

      await ActivityController.deleteActivity(req as Request, res as Response, next);

      expect(deleteSpy).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith(deleted);
    });

    it('should throw BadRequestError for invalid activityId', async () => {
      req.params = { activityId: 'xxx' };
      await ActivityController.deleteActivity(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });

    it('should throw NotFoundError when activity not found', async () => {
      req.params = { activityId: '5' };
      jest.spyOn(ActivityService.prototype, 'delete').mockResolvedValue(null as any);

      await ActivityController.deleteActivity(req as Request, res as Response, next);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });

  describe('updateActivity', () => {
    it('should update activity successfully', async () => {
      req.params = { itineraryId: '1', activityId: '10' };
      req.body = {
        name: 'Updated',
        location: 'Location Z',
        title: 'Title Z',
        price: null,
        startTime: new Date(),
        endTime: new Date(),
        duration: '01:30',
        description: null,
        destinationId: null,
      };

      const updated = {
        id: 10,
        ...req.body,
        itineraryId: 1,
      };

      const updateSpy = jest.spyOn(ActivityService.prototype, 'update').mockResolvedValue(updated);

      await ActivityController.updateActivity(req as Request, res as Response, next);

      expect(updateSpy).toHaveBeenCalledWith(10, 1, req.body);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updated);
    });

    it('should throw BadRequestError for invalid params', async () => {
      req.params = { itineraryId: 'invalid', activityId: '1' };
      await ActivityController.updateActivity(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });

  describe('getActivities', () => {
    it('should return activities for a given itinerary and user', async () => {
      req.params = { itineraryId: '1', userId: '2' };
      const mockActivities = [
        {
          id: 1,
          name: 'Visit Museum',
          location: 'City A',
          title: 'Title A',
          price: null,
          startTime: new Date(),
          endTime: new Date(),
          duration: '02:00',
          description: null,
          itineraryId: 1,
          destinationId: null,
        },
      ];

      const findAllSpy = jest
        .spyOn(ActivityService.prototype, 'findAllOrderedByDate')
        .mockResolvedValue(mockActivities);

      await ActivityController.getActivities(req as Request, res as Response, next);

      expect(findAllSpy).toHaveBeenCalledWith(1, 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockActivities);
    });

    it('should throw BadRequestError for invalid userId or itineraryId', async () => {
      req.params = { itineraryId: '1', userId: 'invalid' };
      await ActivityController.getActivities(req as Request, res as Response, next);
      expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    });
  });
});
