import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

type JwtPayload = {
  id: number;
};

export function generateToken(payload: object) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET isn't defined!");
  return jwt.sign(payload, secret, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET isn't defined");

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded;
  } catch {
    throw new Error('Invalid or expired token');
  }
}
