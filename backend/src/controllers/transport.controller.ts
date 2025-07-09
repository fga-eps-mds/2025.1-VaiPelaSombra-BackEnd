import { Request, Response, NextFunction } from 'express';
import { TransportService } from '../services/transport.service';
import { CreateTransportSchema, UpdateTransportSchema } from '../dtos/transport.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';

const transportService = new TransportService();

export class TransportController {
  service: TransportService = transportService;
  constructor() {}

  async createTransport(req: Request, res: Response, next: NextFunction) {
    try {
      const data = CreateTransportSchema.parse(req.body);
      const created = await this.service.createTransport(data);
      res.status(201).json(created);
    } catch (error) {
      next(error);
    }
  }

  async updateTransport(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid transport id');

      const data = UpdateTransportSchema.parse(req.body);
      const updated = await this.service.updateTransport(id, data);
      if (!updated) throw new NotFoundError('Transport not found');
      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async getTransportById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid transport id');

      const transport = await this.service.getTransportById(id);
      if (!transport) throw new NotFoundError('Transport not found');
      res.status(200).json(transport);
    } catch (error) {
      next(error);
    }
  }

  async getAllTransports(_req: Request, res: Response, next: NextFunction) {
    try {
      const transports = await this.service.getAllTransports();
      res.status(200).json(transports);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransport(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new BadRequestError('Invalid transport id');

      const deleted = await this.service.deleteTransport(id);
      if (!deleted) throw new NotFoundError('Transport not found');
      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
