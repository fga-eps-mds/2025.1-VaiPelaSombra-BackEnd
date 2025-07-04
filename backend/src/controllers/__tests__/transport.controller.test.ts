import { TransportController } from '../transport.controller';
import { TransportService } from '../../services/transport.service';
import { Request, Response, NextFunction } from 'express';
import { NotFoundError } from '../../errors/httpError';

jest.mock('../../services/transport.service');

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn() as NextFunction;

describe('TransportController', () => {
  let controller: TransportController;
  let service: jest.Mocked<TransportService>;
  const req = {} as Request;
  const res = mockResponse();

  beforeEach(() => {
    service = new TransportService() as jest.Mocked<TransportService>;
    controller = new TransportController(service);
    jest.clearAllMocks();
  });

  it('deve criar um transporte com sucesso', async () => {
    const mockBody = {
      type: 'Avião',
      cost: 400,
      departure: new Date().toISOString(),
      arrival: new Date().toISOString(),
      duration: '2h',
      description: 'Voo para o Rio',
      itineraryId: 1,
    };

    const mockCreated = {
      type: 'Avião',
      cost: 400,
      departure: new Date().toISOString(),
      arrival: new Date().toISOString(),
      duration: '2h',
      description: 'Voo para o Rio',
      itineraryId: 1,
     };
    service.createTransport.mockResolvedValue(mockCreated);

    await controller.createTransport(req, res, mockNext);

    expect(service.createTransport).toHaveBeenCalledWith(mockBody);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockCreated);
  });

  it('deve retornar um transporte por ID', async () => {
    req.params = { id: '1' };

    const mockTransport = {
      id: 1,
      type: 'Ônibus',
      cost: 120,
      departure: new Date().toISOString(),
      arrival: new Date().toISOString(),
      duration: '6h',
      description: 'Viagem longa',
      itineraryId: 2,
    };

    service.getTransportById.mockResolvedValue(mockTransport);

    await controller.getTransportById(req, res, mockNext);

    expect(service.getTransportById).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockTransport);
  });

  it('deve atualizar um transporte existente', async () => {
    req.params = { id: '1' };
    req.body = {
      type: 'Trem',
      cost: 250,
      description: 'Atualizado',
    };

    const mockUpdated = { id: 1, ...req.body };

    service.updateTransport.mockResolvedValue(mockUpdated);

    await controller.updateTransport(req, res, mockNext);

    expect(service.updateTransport).toHaveBeenCalledWith(1, req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockUpdated);
  });

  it('deve deletar um transporte', async () => {
    req.params = { id: '1' };

    service.deleteTransport.mockResolvedValue(true);

    await controller.deleteTransport(req, res, mockNext);

    expect(service.deleteTransport).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Transporte deletado com sucesso.' });
  });

  it('deve retornar 404 ao buscar transporte inexistente', async () => {
    req.params = { id: '999' };
    service.getTransportById.mockResolvedValue(null);

    await controller.getTransportById(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(new NotFoundError('Transport not found'));
  });
});
