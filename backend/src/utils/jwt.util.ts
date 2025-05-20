
import jwt from 'jsonwebtoken';

export function gerarToken(payload: object): string {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: '1h',
  });
}
