import { AuthService } from '../auth.service';
import { prisma } from '../../data/prismaClient';
import bcrypt from 'bcrypt';
import * as jwtUtil from '../../utils/jwt.util';
import { BadRequestError, NotFoundError } from '../../errors/httpError';

jest.mock('../../data/prismaClient', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

jest.mock('../../utils/jwt.util', () => ({
  generateTokens: jest.fn(),
  generateAccessToken: jest.fn(),
  verifyRefreshToken: jest.fn(),
}));

const authService = new AuthService();

describe('AuthService', () => {
  const mockUser = {
    id: 1,
    name: 'Pablo',
    email: 'pablo@example.com',
    password: 'hashed-password',
  };

  const tokens = {
    accessToken: 'access-token',
    refreshToken: 'refresh-token',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should throw BadRequestError if user not found', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.login('invalid@example.com', '123')).rejects.toThrow(
        BadRequestError
      );
    });

    it('should throw BadRequestError if password is invalid', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(authService.login(mockUser.email, 'wrong-password')).rejects.toThrow(
        BadRequestError
      );
    });

    it('should return tokens and user info on valid login', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwtUtil.generateTokens as jest.Mock).mockReturnValue(tokens);

      const result = await authService.login(mockUser.email, 'correct-password');

      expect(result).toEqual({
        ...tokens,
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: mockUser.email } });
      expect(bcrypt.compare).toHaveBeenCalledWith('correct-password', mockUser.password);
      expect(jwtUtil.generateTokens).toHaveBeenCalled();
    });
  });

  describe('refreshToken', () => {
    it('should throw NotFoundError if user not found', async () => {
      (jwtUtil.verifyRefreshToken as jest.Mock).mockReturnValue({ id: 1, email: mockUser.email });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(authService.refreshToken('some-refresh-token')).rejects.toThrow(NotFoundError);
    });

    it('should return new accessToken and user info', async () => {
      (jwtUtil.verifyRefreshToken as jest.Mock).mockReturnValue({ id: 1, email: mockUser.email });
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (jwtUtil.generateAccessToken as jest.Mock).mockReturnValue('new-access-token');

      const result = await authService.refreshToken('valid-refresh-token');

      expect(result).toEqual({
        accessToken: 'new-access-token',
        user: {
          id: mockUser.id,
          name: mockUser.name,
          email: mockUser.email,
        },
      });

      expect(jwtUtil.verifyRefreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(jwtUtil.generateAccessToken).toHaveBeenCalled();
    });
  });

  describe('logout', () => {
    it('should return success message', async () => {
      const result = await authService.logout();
      expect(result).toEqual({ message: 'Logged out successfully' });
    });
  });
});
