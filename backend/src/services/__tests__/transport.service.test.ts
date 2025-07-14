import { TransportService } from '../../services/transport.service';
import { prisma } from '../../data/prismaClient';
import { Decimal } from 'decimal.js';

jest.mock('../../data/prismaClient', () => ({
  prisma: {
    transport: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('TransportService', () => {
  const service = new TransportService();

  const baseDTO = {
    type: 'Bus',
    company: 'Company A',
    cost: 150,
    itineraryId: 1, // ✅ campo obrigatório adicionado
    departure: new Date('2025-08-01T08:00:00Z'),
    arrival: new Date('2025-08-01T12:00:00Z'),
    duration: '4h',
    description: 'Viagem teste',
  };

  it('should create transport', async () => {
    const mockTransport = {
      id: 1,
      ...baseDTO,
      cost: new Decimal(baseDTO.cost),
    };

    (prisma.transport.create as jest.Mock).mockResolvedValue(mockTransport);

    const result = await service.createTransport(baseDTO);
    expect(prisma.transport.create).toHaveBeenCalled();
    expect(result.id).toBe(1);
  });

  it('should get transport by id', async () => {
    (prisma.transport.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    const result = await service.getTransportById(1);
    expect(result?.id).toBe(1);
  });

  it('should return null if transport not found by id', async () => {
    (prisma.transport.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.getTransportById(999);
    expect(result).toBeNull();
  });

  it('should get all transports', async () => {
    (prisma.transport.findMany as jest.Mock).mockResolvedValue([{ id: 1 }, { id: 2 }]);
    const result = await service.getAllTransports();
    expect(result).toHaveLength(2);
  });

  it('should update transport if exists', async () => {
    const updatedDTO = { ...baseDTO, type: 'Train' };
    const updatedTransport = {
      id: 1,
      ...updatedDTO,
      cost: new Decimal(updatedDTO.cost),
    };

    (prisma.transport.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.transport.update as jest.Mock).mockResolvedValue(updatedTransport);

    const result = await service.updateTransport(1, updatedDTO);
    expect(prisma.transport.update).toHaveBeenCalled();
    expect(result?.type).toBe('Train');
  });

  it('should return null if trying to update non-existent transport', async () => {
    (prisma.transport.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.updateTransport(999, baseDTO);
    expect(result).toBeNull();
  });

  it('should delete transport if exists', async () => {
    (prisma.transport.findUnique as jest.Mock).mockResolvedValue({ id: 1 });
    (prisma.transport.delete as jest.Mock).mockResolvedValue({});

    const result = await service.deleteTransport(1);
    expect(result).toBe(true);
    expect(prisma.transport.delete).toHaveBeenCalled();
  });

  it('should return false if transport not found on delete', async () => {
    (prisma.transport.findUnique as jest.Mock).mockResolvedValue(null);
    const result = await service.deleteTransport(999);
    expect(result).toBe(false);
  });
});