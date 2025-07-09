import { TransportController } from '../transport.controller';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError, BadRequestError } from '../../errors/httpError';

type TransportServiceMock = {
  createTransport: jest.Mock;
  getTransportById: jest.Mock;
  updateTransport: jest.Mock;
  deleteTransport: jest.Mock;
  normalizeDuration: jest.Mock;
  normalizeDate: jest.Mock;
  normalizeCost: jest.Mock;
  getAllTransports: jest.Mock;
};

const mockResponse = (): jest.Mocked<Response> => {
  const res = {} as jest.Mocked<Response>;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext: NextFunction = jest.fn();

describe('TransportController', () => {
  let controller: TransportController;
  let service: TransportServiceMock;
  let req: Partial<Request>;
  let res: jest.Mocked<Response>;

  beforeEach(() => {
    service = {
      createTransport: jest.fn(),
      getTransportById: jest.fn(),
      updateTransport: jest.fn(),
      deleteTransport: jest.fn(),
      normalizeDuration: jest.fn(),
      normalizeDate: jest.fn(),
      normalizeCost: jest.fn(),
      getAllTransports: jest.fn(),
    };

    controller = new TransportController();
    req = {};
    res = mockResponse();
    jest.clearAllMocks();
  });

  // it('deve criar um transporte com sucesso', async () => {
  //   const body = {
  //     type: 'Avião',
  //     cost: 400,
  //     departure: new Date().toISOString(),
  //     arrival: new Date().toISOString(),
  //     duration: '2h',
  //     description: 'Voo para o Rio',
  //     itineraryId: 1,
  //   };
  //   req.body = body;

  //   const created = { id: 1, ...body };
  //   service.createTransport.mockResolvedValue(created);

  //   await controller.createTransport(req as Request, res, mockNext);

  //   expect(service.createTransport).toHaveBeenCalledWith(body);
  //   expect(res.status).toHaveBeenCalledWith(201);
  //   expect(res.json).toHaveBeenCalledWith(created);
  // });

  // it('deve retornar um transporte por ID', async () => {
  //   req.params = { id: '1' };

  //   const found = {
  //     id: 1,
  //     type: 'Ônibus',
  //     cost: 120,
  //     departure: new Date().toISOString(),
  //     arrival: new Date().toISOString(),
  //     duration: '6h',
  //     description: 'Viagem longa',
  //     itineraryId: 2,
  //   };
  //   service.getTransportById.mockResolvedValue(found);

  //   await controller.getTransportById(req as Request, res, mockNext);

  //   expect(service.getTransportById).toHaveBeenCalledWith(1);
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith(found);
  // });

  // it('deve atualizar um transporte existente', async () => {
  //   req.params = { id: '1' };
  //   req.body = { type: 'Trem', cost: 250, description: 'Atualizado' };

  //   const updated = { id: 1, ...req.body };
  //   service.updateTransport.mockResolvedValue(updated);

  //   await controller.updateTransport(req as Request, res, mockNext);

  //   expect(service.updateTransport).toHaveBeenCalledWith(1, req.body);
  //   expect(res.status).toHaveBeenCalledWith(200);
  //   expect(res.json).toHaveBeenCalledWith(updated);
  // });

  // it('deve deletar um transporte', async () => {
  //   req.params = { id: '1' };
  //   service.deleteTransport.mockResolvedValue(true);

  //   await controller.deleteTransport(req as Request, res, mockNext);

  //   expect(service.deleteTransport).toHaveBeenCalledWith(1);
  //   expect(res.status).toHaveBeenCalledWith(204);
  //   expect(res.end).toHaveBeenCalled();
  // });

  // it('deve acionar NotFoundError para transporte inexistente', async () => {
  //   req.params = { id: '999' };
  //   service.getTransportById.mockResolvedValue(null);

  //   await controller.getTransportById(req as Request, res, mockNext);

  //   expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
  //   expect((mockNext as jest.Mock).mock.calls[0][0]).toBeInstanceOf(NotFoundError);
  // });

  it('deve acionar BadRequestError para ID inválido', async () => {
    req.params = { id: 'abc' };

    await controller.getTransportById(req as Request, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });
});
