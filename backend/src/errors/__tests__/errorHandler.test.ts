import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { errorHandler } from '../errorHandler';
import { NotFoundError } from '../httpError';

describe('errorHandler middleware', () => {
  const createMockRes = () => {
    return {
      status: (code: number) => ({
        json: (data: any) => {
          console.log('STATUS:', code);
          console.log('RESPONSE:', data);
        },
      }),
    } as unknown as Response;
  };

  const mockReq = {} as Request;
  const mockNext = {} as NextFunction;

  it('should handle jwt.TokenExpiredError', () => {
    const error = new jwt.TokenExpiredError('jwt expired', new Date());
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle jwt.NotBeforeError', () => {
    const error = new jwt.NotBeforeError('jwt not active', new Date());
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle jwt.JsonWebTokenError (generic)', () => {
    const error = new jwt.JsonWebTokenError('invalid token');
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle PrismaClientKnownRequestError - P2002', () => {
    const error = {
      name: 'PrismaClientKnownRequestError',
      code: 'P2002',
    } as any;
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle PrismaClientValidationError', () => {
    const error = { name: 'PrismaClientValidationError', message: 'Validation error' } as any;
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle ZodError', () => {
    const error = new z.ZodError([
      {
        path: ['email'],
        message: 'Invalid email',
        code: 'custom',
      },
    ]);
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle generic HttpError', () => {
    const error = new NotFoundError('Not found');
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });

  it('should handle unknown error', () => {
    const error = new Error('Unknown failure');
    const res = createMockRes();
    errorHandler(error, mockReq, res, mockNext);
  });
});
