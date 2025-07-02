import { Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
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

      await UserController.getUserProfile(req as Request, res as Response);

      expect(UserService.prototype.findById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it('deve retornar 404 se o usuário não existir', async () => {
      req.params = { id: '2' };

      jest.spyOn(UserService.prototype, 'findById').mockResolvedValueOnce(null);

      await UserController.getUserProfile(req as Request, res as Response);

      expect(UserService.prototype.findById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('deve retornar 500 se ocorrer um erro inesperado', async () => {
      req.params = { id: '2' };

      jest.spyOn(UserService.prototype, 'findById').mockRejectedValueOnce(new Error('DB error'));

      await UserController.getUserProfile(req as Request, res as Response);

      expect(UserService.prototype.findById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: 'Error fetching user profile' })
      );
    });
  });
});
