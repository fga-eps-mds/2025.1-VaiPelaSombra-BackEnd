import { Request, Response, NextFunction } from 'express';
import { TransportService } from '../services/transport.service';
import { CreateTransportSchema, UpdateTransportSchema } from '../dtos/transport.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';

interface AuthRequest extends Request {
  user?: { id: number };
}

const transportService = new TransportService();

export class TransportController {
  service: TransportService = transportService;

  constructor() {}

  async createTransport(req: Request, res: Response, next: NextFunction) {
    try {
      // Usa o DTO que inclui itineraryId
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
      if (isNaN(id)) throw new BadRequestError('ID do transporte inválido');

      const data = UpdateTransportSchema.parse(req.body);
      const updated = await this.service.updateTransport(id, data);
      if (!updated) throw new NotFoundError('Transporte não encontrado');

      res.status(200).json(updated);
    } catch (error) {
      next(error);
    }
  }

  async getTransportById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new BadRequestError('ID do transporte inválido');

      const transport = await this.service.getTransportById(id);
      if (!transport) throw new NotFoundError('Transporte não encontrado');

      res.status(200).json(transport);
    } catch (error) {
      next(error);
    }
  }

  async getTransportsByItinerary(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const itineraryId = parseInt(req.params.itineraryId);
      if (isNaN(itineraryId)) throw new BadRequestError('ID do itinerário inválido');

      const transports = await this.service.getTransportsByItinerary(itineraryId);
      res.status(200).json(transports);
    } catch (error) {
      next(error);
    }
  }

  async deleteTransport(req: Request, res: Response, next: NextFunction) {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) throw new BadRequestError('ID do transporte inválido');

      const deleted = await this.service.deleteTransport(id);
      if (!deleted) throw new NotFoundError('Transporte não encontrado');

      res.status(204).end();
    } catch (error) {
      next(error);
    }
  }
}
