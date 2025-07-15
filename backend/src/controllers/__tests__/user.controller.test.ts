import { Request, Response, NextFunction } from 'express';
import { UserController } from '../../controllers/user.controller';
import { UserService } from '../../services/user.service';
import { NotFoundError } from '../../errors/httpError';
import bcrypt from 'bcrypt';

jest.mock('../../services/user.service');
jest.mock('bcrypt');

describe('UserController', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock;

  beforeEach(() => {
    req = { body: {}, params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  // ✅ TESTE CORRIGIDO
  describe('createUser', () => {
    it('deve criar um novo usuário', async () => {
      req.body = {
        name: 'Test User',
        email: 'test@test.com',
        password: '123456Aa@',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword');

      const mockCreatedUser = {
        id: 1,
        name: 'Test User',
        email: 'test@test.com',
        password: 'hashedpassword',
        createdAt: new Date(),
      };

      (UserService.prototype.create as jest.Mock).mockResolvedValueOnce(mockCreatedUser);

      await UserController.createUser(req as Request, res as Response, next as NextFunction);

      expect(bcrypt.hash).toHaveBeenCalledWith('123456Aa@', 10);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ email: 'test@test.com' }));
    });
  });

  // ✅ TESTE CORRIGIDO
  describe('updateUser', () => {
    it('deve atualizar um usuário existente', async () => {
      req.params = { id: '1' };
      req.body = {
        name: 'Updated User',
        email: 'updated@example.com',
        password: '123456Aa@',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword');

      const mockUpdatedUser = {
        id: 1,
        name: 'Updated User',
        email: 'updated@example.com',
        password: 'hashedpassword',
      };

      (UserService.prototype.update as jest.Mock).mockResolvedValueOnce(mockUpdatedUser);

      await UserController.updateUser(req as Request, res as Response, next as NextFunction);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });

    it('deve retornar erro se usuário não encontrado', async () => {
      req.params = { id: '999' };
      req.body = {
        name: 'NotFound',
        email: 'notfound@test.com',
        password: '123456Aa@', // precisa ser válido para o Zod passar
      };

      (bcrypt.hash as jest.Mock).mockResolvedValueOnce('hashedpassword');

      (UserService.prototype.update as jest.Mock).mockResolvedValueOnce(null);

      await UserController.updateUser(req as Request, res as Response, next as NextFunction);

      expect(next).toHaveBeenCalledWith(expect.any(NotFoundError));
    });
  });
});
