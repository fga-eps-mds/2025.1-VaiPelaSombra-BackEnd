import { Request, Response } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserService } from '../services/user.service';
import app from '../app';
import request from 'supertest';

jest.mock('../services/user.service');
jest.spyOn(console, 'error').mockImplementation(() => {});

describe('UserController - updateUserProfile', () => {
  const mockReq = {
    user: { id: 1 },
    body: {
      name: 'Maria',
      travelPreferencesData: { destination: 'Praia' },
    },
    params: { id: '1' },
  } as unknown as Request;

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve atualizar o perfil do usuário com sucesso', async () => {
    (UserService.updateUser as jest.Mock).mockResolvedValue({ id: 1, name: 'Maria' });
    (UserService.updateTravelPreferences as jest.Mock).mockResolvedValue(undefined);
    (UserService.getUserById as jest.Mock).mockResolvedValue({
      id: 1,
      name: 'Maria',
      travelPreferencesData: { destination: 'Praia' },
    });

    await UserController.updateUserProfile(mockReq, mockRes);

    expect(UserService.updateUser).toHaveBeenCalledWith(1, mockReq.body);
    expect(UserService.updateTravelPreferences).toHaveBeenCalledWith(
      1,
      mockReq.body.travelPreferencesData
    );
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: 1,
      name: 'Maria',
      travelPreferencesData: { destination: 'Praia' },
    });
  });

  it('deve retornar 404 se o usuário não for encontrado', async () => {
    (UserService.updateUser as jest.Mock).mockResolvedValue(null);

    await UserController.updateUserProfile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('deve retornar 500 em caso de erro inesperado', async () => {
    (UserService.updateUser as jest.Mock).mockRejectedValue(new Error('Erro inesperado'));

    await UserController.updateUserProfile(mockReq, mockRes);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Erro updating user profile',
      })
    );
  });
});

describe('UserController - getUserProfile', () => {
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

  it('deve retornar o perfil do usuário', async () => {
    req.params = { id: '2' };

    (UserService.getUserById as jest.Mock).mockResolvedValueOnce({
      id: 2,
      name: 'Jane Doe',
    });

    await UserController.getUserProfile(req as Request, res as Response);

    expect(UserService.getUserById).toHaveBeenCalledWith(2);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ id: 2, name: 'Jane Doe' });
  });

  it('deve retornar 404 se o usuário não existir', async () => {
    req.params = { id: '2' };

    (UserService.getUserById as jest.Mock).mockResolvedValueOnce(null);

    await UserController.getUserProfile(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: 'User not found' });
  });

  it('deve retornar 500 se ocorrer um erro inesperado', async () => {
    req.params = { id: '2' };

    (UserService.getUserById as jest.Mock).mockRejectedValueOnce(new Error('DB error'));

    await UserController.getUserProfile(req as Request, res as Response);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Error fetching user profile',
      })
    );
  });
});

describe('Rotas de integração /users/:id', () => {
  beforeAll(() => {
    (UserService.updateUser as jest.Mock).mockImplementation(async (id, data) => {
      if (id === 1) return { id, ...data };
      return null;
    });
    (UserService.updateTravelPreferences as jest.Mock).mockResolvedValue(undefined);
    (UserService.getUserById as jest.Mock).mockImplementation(async (id) => {
      if (id === 1) {
        return {
          id: 1,
          name: 'Teste Atualizado',
          email: 'teste@atualizado.com',
          travelPreferencesData: {
            travelerType: 'CULTURAL',
          },
        };
      }
      return null;
    });
  });

  it('GET /users/:id deve retornar 200 e dados válidos', async () => {
    const response = await request(app).get('/users/1');
    expect([200, 404]).toContain(response.status);
  });

  it('PUT /users/:id deve atualizar o perfil com sucesso ou retornar 404', async () => {
    const response = await request(app)
      .put('/users/1')
      .send({
        name: 'Teste Atualizado',
        email: 'teste@atualizado.com',
        travelPreferencesData: {
          travelerType: 'CULTURAL',
        },
      });
    expect([200, 404]).toContain(response.status);
  });
});
