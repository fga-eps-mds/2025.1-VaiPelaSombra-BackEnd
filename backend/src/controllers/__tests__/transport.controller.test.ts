import { TransportController } from '../transport.controller';
import { Request, Response, NextFunction } from 'express';
import { BadRequestError, NotFoundError } from '../../errors/httpError';
import { TransportService } from '../../services/transport.service';

jest.mock('../../services/transport.service');

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
  let service: jest.Mocked<TransportService>;
  let req: Partial<Request>;
  let res: jest.Mocked<Response>;

  beforeEach(() => {
    service = new TransportService() as jest.Mocked<TransportService>;
    controller = new TransportController();
    controller['service'] = service;

    req = {};
    res = mockResponse();
    jest.clearAllMocks();
  });

  it('deve criar um transporte com sucesso', async () => {
    req.body = { type: 'teste', cost: 1, itineraryId: 1 };
    service.createTransport.mockResolvedValue({} as any);

    await controller.createTransport(req as Request, res, mockNext);

    expect(service.createTransport).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalled();
  });

  it('deve retornar um transporte por ID', async () => {
    req.params = { id: '1' };
    service.getTransportById.mockResolvedValue({} as any);

    await controller.getTransportById(req as Request, res, mockNext);

    expect(service.getTransportById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('deve atualizar um transporte existente', async () => {
    req.params = { id: '1' };
    req.body = { type: 'teste' };
    service.updateTransport.mockResolvedValue({} as any);

    await controller.updateTransport(req as Request, res, mockNext);

    expect(service.updateTransport).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  it('deve deletar um transporte', async () => {
    req.params = { id: '1' };
    service.deleteTransport.mockResolvedValue(true);

    await controller.deleteTransport(req as Request, res, mockNext);

    expect(service.deleteTransport).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.end).toHaveBeenCalled();
  });

  it('deve retornar NotFoundError se transporte não existir', async () => {
    req.params = { id: '999' };
    service.getTransportById.mockResolvedValue(null);

    await controller.getTransportById(req as Request, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(NotFoundError));
  });

  it('deve retornar BadRequestError para ID inválido', async () => {
    req.params = { id: 'abc' };

    await controller.getTransportById(req as Request, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(expect.any(BadRequestError));
  });

  it('deve listar transportes de um itinerário', async () => {
    req.params = { itineraryId: '1' };
    service.getTransportsByItinerary.mockResolvedValue([] as any);

    await controller.getTransportsByItinerary(req as Request, res, mockNext);

    expect(service.getTransportsByItinerary).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});
