import { ApiError } from '../utils/api.errors.util';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const errorMiddleware = (
  error: Error & Partial<ApiError>,
  req: Request,
  res: Response
  //next: NextFunction
) => {
  const statusCode = error.statusCode ?? 500;
  const message = error.statusCode ? error.message : 'Internal Server Error';

  return res.status(statusCode).json({ message });
};
export interface AuthenticatedRequest extends Request {
  user: { id: number };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Token não fornecido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: number };
    req.user = { id: decoded.id };
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido.' });
  }
};
