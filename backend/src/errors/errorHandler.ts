import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {
  BadRequestError,
  ConflictError,
  HttpError,
  InternalServerError,
  NotFoundError,
  UnprocessableEntityError,
  ForbiddenError,
} from './httpError';
import { Prisma } from '../generated/prisma';
import { z } from 'zod';

export const errorHandler: ErrorRequestHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  // JWT errors mapped to your custom errors
  if (error instanceof jwt.JsonWebTokenError) {
    if (error instanceof jwt.TokenExpiredError) {
      error = new ForbiddenError('Access token has expired');
    } else if (error instanceof jwt.NotBeforeError) {
      error = new BadRequestError('Token is not active yet');
    } else {
      error = new BadRequestError('Invalid token provided');
    }
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        error = new ConflictError('A record with this unique field already exists.');
        break;
      case 'P2025':
        error = new NotFoundError('Resource not found.');
        break;
      case 'P2003':
        error = new BadRequestError('Invalid reference: related record does not exist.');
        break;
      case 'P2014':
        error = new BadRequestError('Cannot delete or disconnect required related records.');
        break;
      default:
        error = new UnprocessableEntityError('A database error occurred.');
        break;
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    error = new InternalServerError('Validation database error occurred');
  }
  if (error instanceof Prisma.PrismaClientInitializationError) {
    error = new InternalServerError('Connection database error occurred ');
  }
  if (error instanceof Prisma.PrismaClientUnknownRequestError) {
    error = new InternalServerError('Unknown database error occurred');
  }
  if (error instanceof HttpError) {
    res.status(error.status).json({
      status: error.status,
      error: error.name,
      message: error.message,
    });
    return;
  }

  if (error instanceof z.ZodError) {
    res.status(400).json({
      status: 400,
      error: 'ValidationError',
      message: 'Validation error',
      details: error.errors.map((e) => ({
        path: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  res.status(500).json({
    status: 500,
    error: 'Internal Server Error',
    message: error.message,
  });
};
