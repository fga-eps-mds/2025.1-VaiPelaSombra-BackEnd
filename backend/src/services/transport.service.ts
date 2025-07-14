import { Transport } from '../generated/prisma';
import { prisma } from '../data/prismaClient';
import { CreateTransportDTO, UpdateTransportDTO } from '../dtos/transport.dto';
import { Decimal } from 'decimal.js';

export class TransportService {
  normalizeDuration(duration: string | Date | null | undefined): string | null {
    if (duration instanceof Date) return duration.toISOString();
    if (typeof duration === 'string') return duration;
    return null;
  }

  normalizeDate(value: string | Date | null | undefined): Date | null {
    if (value instanceof Date) return value;
    if (typeof value === 'string') return new Date(value);
    return null;
  }

  normalizeCost(cost: number | undefined): Decimal | undefined {
    return cost !== undefined ? new Decimal(cost) : undefined;
  }

  async createTransport(data: CreateTransportDTO): Promise<Transport> {
    return prisma.transport.create({
      data: {
        ...data,
        cost: this.normalizeCost(data.cost)!,
        departure: this.normalizeDate(data.departure),
        arrival: this.normalizeDate(data.arrival),
        duration: this.normalizeDuration(data.duration),
      },
    });
  }

  async getTransportById(id: number): Promise<Transport | null> {
    return prisma.transport.findUnique({ where: { id } });
  }

  async getTransportsByItinerary(itineraryId: number): Promise<Transport[]> {
    return prisma.transport.findMany({
      where: { itineraryId },
      orderBy: { departure: 'asc' },
    });
  }

  async updateTransport(id: number, data: UpdateTransportDTO): Promise<Transport | null> {
    const exists = await prisma.transport.findUnique({ where: { id } });
    if (!exists) return null;

    return prisma.transport.update({
      where: { id },
      data: {
        ...data,
        cost: this.normalizeCost(data.cost),
        departure: this.normalizeDate(data.departure),
        arrival: this.normalizeDate(data.arrival),
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
