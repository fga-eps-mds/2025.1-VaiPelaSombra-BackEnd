import { Transport } from '../generated/prisma';
import { prisma } from '../data/prismaClient';
import { CreateTransportDTO, UpdateTransportDTO } from '../dtos/transport.dto';

export class TransportService {
  private normalizeDuration(duration: string | Date | null | undefined): string | null {
    if (duration instanceof Date) return duration.toISOString();
    if (typeof duration === 'string') return duration;
    return null;
  }

  async createTransport(data: CreateTransportDTO): Promise<Transport> {
    return prisma.transport.create({
      data: {
        ...data,
        duration: this.normalizeDuration(data.duration),
      },
    });
  }

  async getTransportById(id: number): Promise<Transport | null> {
    return prisma.transport.findUnique({ where: { id } });
  }

  async getAllTransports(): Promise<Transport[]> {
    return prisma.transport.findMany();
  }

  async updateTransport(id: number, data: UpdateTransportDTO): Promise<Transport | null> {
    const exists = await prisma.transport.findUnique({ where: { id } });
    if (!exists) return null;

    return prisma.transport.update({
      where: { id },
      data: {
        ...data,
        duration: this.normalizeDuration(data.duration),
      },
    });
  }

  async deleteTransport(id: number): Promise<boolean> {
    const exists = await prisma.transport.findUnique({ where: { id } });
    if (!exists) return false;

    await prisma.transport.delete({ where: { id } });
    return true;
  }
}
