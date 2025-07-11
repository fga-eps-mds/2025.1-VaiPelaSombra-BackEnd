import { Request, Response, NextFunction } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { NotFoundError } from '../errors/httpError';

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  describe('getUserProfile', () => {
    it('deve retornar o perfil do usuário', async () => {
      req.params = { id: '2' };

      const mockUser = {
        id: 2,
        name: 'Jane Doe',
        email: 'jane@example.com',
        password: 'hashedpassword',
        createdAt: new Date(),
        profileBio: null,
        profileImage: null,
        travelPreferences: null,
      };

      jest.spyOn(UserService.prototype, 'findById').mockResolvedValueOnce(mockUser);

      await UserController.getUserProfile(req as Request, res as Response, next as NextFunction);

      expect(UserService.prototype.findById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('deve chamar next com NotFoundError se o usuário não existir', async () => {
      req.params = { id: '2' };

      jest.spyOn(UserService.prototype, 'findById').mockResolvedValueOnce(null);

      await UserController.getUserProfile(req as Request, res as Response, next as NextFunction);

      expect(UserService.prototype.findById).toHaveBeenCalledWith(2);
      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });

    it('deve chamar next com erro se ocorrer um erro inesperado', async () => {
      req.params = { id: '2' };

      const error = new Error('DB error');
      jest.spyOn(UserService.prototype, 'findById').mockRejectedValueOnce(error);

      await UserController.getUserProfile(req as Request, res as Response, next as NextFunction);

      expect(UserService.prototype.findById).toHaveBeenCalledWith(2);
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
    });
  });
});
