import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import { Request, Response } from 'express';


jest.mock('../services/user.service');

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('UserController', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getUserById', () => {
    it('deve retornar o usuário (sucesso)', () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      (UserService.getUserById as jest.Mock).mockReturnValue({ id: 1, name: 'John Doe' });

      UserController.getUserById(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'John Doe' });
    });

    it('deve retornar 404 se usuário não for encontrado', () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      (UserService.getUserById as jest.Mock).mockReturnValue(null);

      UserController.getUserById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('createUser', () => {
    it('deve criar um novo usuário (sucesso)', async () => {
      const req = {
        body: { name: 'Alice', email: 'alice@example.com', password: '123456' },
      } as Request;
      const res = mockResponse();
      (UserService.createUser as jest.Mock).mockResolvedValue({ id: 1, name: 'Alice' });

      await UserController.createUser(req, res);

      expect(UserService.createUser).toHaveBeenCalledWith({
        name: 'Alice',
        email: 'alice@example.com',
        password: '123456',
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ id: 1, name: 'Alice' });
    });

    it('deve retornar 400 se faltar campos obrigatórios', async () => {
      const req = { body: { email: 'alice@example.com' } } as Request;
      const res = mockResponse();

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'Name and email are required' });
    });

    it('deve retornar 500 em caso de erro inesperado', async () => {
      const req = {
        body: { name: 'Bob', email: 'bob@example.com', password: '123' },
      } as Request;
      const res = mockResponse();
      (UserService.createUser as jest.Mock).mockRejectedValue(new Error('DB error'));

      await UserController.createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error creating user',
        error: expect.any(Error),
      });
    });
  });

  describe('deleteUser', () => {
    it('deve deletar o usuário com sucesso', () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      (UserService.deleteUser as jest.Mock).mockReturnValue(true);

      UserController.deleteUser(req, res);

      expect(UserService.deleteUser).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it('deve retornar 404 se o usuário não existir', () => {
      const req = { params: { id: '1' } } as unknown as Request;
      const res = mockResponse();
      (UserService.deleteUser as jest.Mock).mockReturnValue(false);

      UserController.deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });
  });

  describe('getUserProfile', () => {
    it('deve retornar o perfil do usuário', async () => {
      const req = { user: { id: 2 } } as any;
      const res = mockResponse();
      (UserService.getUserById as jest.Mock).mockResolvedValue({ id: 2, name: 'Jane Doe' });

      await UserController.getUserProfile(req, res);

      expect(UserService.getUserById).toHaveBeenCalledWith(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Jane Doe' });
    });

    it('deve retornar 404 se o usuário não existir', async () => {
      const req = { user: { id: 2 } } as any;
      const res = mockResponse();
      (UserService.getUserById as jest.Mock).mockResolvedValue(null);

      await UserController.getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
    });

    it('deve retornar 500 em caso de erro', async () => {
      const req = { user: { id: 2 } } as any;
      const res = mockResponse();
      (UserService.getUserById as jest.Mock).mockRejectedValue(new Error('DB error'));

      await UserController.getUserProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Error fetching user profile',
        error: expect.any(Error),
      });
    });
  });
});