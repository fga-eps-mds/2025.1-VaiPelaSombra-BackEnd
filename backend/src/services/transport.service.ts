import { Transport } from '@prisma/client';
import { prisma } from '../data/prismaClient';
import { CreateTransportDTO, UpdateTransportDTO } from '../dtos/transport.dto';

export class TransportService {
  async create(data: CreateTransportDTO): Promise<Transport> {
    return prisma.transport.create({ data });
  }

  async findById(idTransporte: number): Promise<Transport | null> {
    return prisma.transport.findUnique({ where: { idTransporte } });
  }

  async findAll(): Promise<Transport[]> {
    return prisma.transport.findMany();
  }

  async update(idTransporte: number, data: UpdateTransportDTO): Promise<Transport | null> {
    const exists = await prisma.transport.findUnique({ where: { idTransporte } });
    if (!exists) return null;

    return prisma.transport.update({
      where: { idTransporte },
      data,
    });
  }

  async delete(idTransporte: number): Promise<Transport | null> {
    return prisma.transport.delete({ where: { idTransporte } });
  }
}
