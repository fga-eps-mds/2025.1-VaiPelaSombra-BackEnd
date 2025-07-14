import { Request, Response } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { AuthService } from '../../services/auth.service';

describe('AuthController', () => {
  let mockAuthService: jest.Mocked<AuthService>;
  let controller: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;

    controller = new AuthController(mockAuthService);
    req = { body: {}, cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
      cookie: jest.fn(),
      clearCookie: jest.fn(),
      send: jest.fn(),
    };
  });

  describe('login', () => {
    it('should return 400 if email or password is missing', async () => {
      req.body = { email: '', password: '' };

      await controller.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required.' });
    });

    it('should login and return tokens if credentials are valid', async () => {
      req.body = { email: 'test@example.com', password: '123456' };

      const mockResult = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
        user: { id: 1, email: 'test@example.com', name: 'Pablo' },
      };

      mockAuthService.login.mockResolvedValue(mockResult);

      await controller.login(req as Request, res as Response);

      expect(mockAuthService.login).toHaveBeenCalledWith('test@example.com', '123456');
      expect(res.cookie).toHaveBeenCalledWith('refreshToken', 'refresh-token', expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        accessToken: 'access-token',
        user: mockResult.user,
      });
    });
  });

  describe('logout', () => {
    it('should logout the user and clear the refresh token cookie', async () => {
      await controller.logout(req as Request, res as Response);

      expect(mockAuthService.logout).toHaveBeenCalled();
      expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe('refreshAccessToken', () => {
    it('should return 401 if refresh token is missing', async () => {
      req.cookies = {};

      await controller.refreshAccessToken(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: 'Refresh token required' });
    });

    it('should refresh the access token if refresh token is present', async () => {
      req.cookies = { refreshToken: 'valid-refresh-token' };
     const mockAccessToken = {
        accessToken: 'new-access-token',
        user: {
            id: 1,
            name: 'Pablo',
            email: 'pablo@example.com',
        },
    };

      mockAuthService.refreshToken.mockResolvedValue(mockAccessToken);

      await controller.refreshAccessToken(req as Request, res as Response);

      expect(mockAuthService.refreshToken).toHaveBeenCalledWith('valid-refresh-token');
      expect(res.json).toHaveBeenCalledWith(mockAccessToken);
    });
  });
});
