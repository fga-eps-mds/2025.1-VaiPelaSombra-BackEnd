import { Request, Response, NextFunction } from 'express';
import { TransportService } from '../services/transport.service';
import { CreateTransportSchema, UpdateTransportSchema } from '../dtos/transport.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';

const transportService = new TransportService();

export const createTransport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = CreateTransportSchema.parse(req.body);
    const created = await transportService.create(data);
    res.status(201).json(created);
  } catch (error) {
    next(error);
  }
};

export const getTransportById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idTransporte = parseInt(req.params.idTransporte);
    if (isNaN(idTransporte)) throw new BadRequestError('Invalid transport id');
    const transport = await transportService.findById(idTransporte);
    if (!transport) throw new NotFoundError('Transport not found');
    res.status(200).json(transport);
  } catch (error) {
    next(error);
  }
};

export const getAllTransports = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const transports = await transportService.findAll();
    res.status(200).json(transports);
  } catch (error) {
    next(error);
  }
};

export const updateTransport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idTransporte = parseInt(req.params.idTransporte);
    if (isNaN(idTransporte)) throw new BadRequestError('Invalid transport id');
    const data = UpdateTransportSchema.parse(req.body);
    const updated = await transportService.update(idTransporte, data);
    if (!updated) throw new NotFoundError('Transport not found');
    res.status(200).json(updated);
  } catch (error) {
    next(error);
  }
};

export const deleteTransport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idTransporte = parseInt(req.params.idTransporte);
    if (isNaN(idTransporte)) throw new BadRequestError('Invalid transport id');
    const deleted = await transportService.delete(idTransporte);
    if (!deleted) throw new NotFoundError('Transport not found');
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
