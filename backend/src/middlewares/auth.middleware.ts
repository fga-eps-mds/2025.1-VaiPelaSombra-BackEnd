import { Request, Response, NextFunction } from 'express';
import { JwtPayload, verifyAccessToken } from '../utils/jwt.util';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export function authenticateUser(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization'];
  const accessToken = authHeader && authHeader.split(' ')[1];
  if (!accessToken) {
    res.status(401).json({ message: 'Access token required' });
    return;
  }

  try {
    const decoded = verifyAccessToken(accessToken) as JwtPayload;
    req.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
}

export function authorizeUser(req: AuthRequest, res: Response, next: NextFunction) {
  const requestedUserId = parseInt(req.params.userId);
  const currentUserId = req.user?.id;

  if (!currentUserId || currentUserId !== requestedUserId) {
    res.status(403).json({ message: 'Access denied: You can only access your own resources' });
    return;
  }
  next();
}
