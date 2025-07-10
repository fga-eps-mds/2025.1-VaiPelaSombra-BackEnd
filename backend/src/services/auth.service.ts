import { prisma } from '../data/prismaClient';
import bcrypt from 'bcrypt';
import { generateAccessToken, generateTokens, verifyRefreshToken } from '../utils/jwt.util';
import { BadRequestError, NotFoundError } from '../errors/httpError';

export class AuthService {
  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestError('Invalid email or password');
    }

    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      throw new BadRequestError('Invalid email or password');
    }

    const tokens = generateTokens({ id: user.id, name: user.name, email: user.email });

    return {
      ...tokens,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async refreshToken(refreshToken: string) {
    const decoded = verifyRefreshToken(refreshToken);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }
    const accessToken = generateAccessToken({
      id: decoded.id,
      name: user.name,
      email: decoded.email,
    });
    return {
      accessToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }
  async logout() {
    return { message: 'Logged out successfully' };
  }
}
