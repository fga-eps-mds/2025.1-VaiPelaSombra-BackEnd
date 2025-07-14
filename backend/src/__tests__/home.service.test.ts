import { prismaMock } from '../data/prismaMock';
import { HomeService } from '../services/home.service';
import { Prisma } from '@prisma/client';

const homeService = new HomeService();

describe('Testes para HomeService', () => {
  describe('funcao: findDestinations()', () => {
    it('deve retornar todos destinos quando search está vazio(undfined)', async () => {
      const mockDestinations = [
        {
          id: 1,
          title: 'Paris',
          locationName: 'France',
          description: 'City of Light',
          latitude: new Prisma.Decimal(48.8566),
          longitude: new Prisma.Decimal(2.3522),
          localClimate: 'Temperate',
          timeZone: 'CET',
          images: [{ url: '/uploads/paris.jpg' }],
        },
        {
          id: 2,
          title: 'Rio de Janeiro',
          locationName: 'Brasil',
          description: 'Marvelous City',
          latitude: new Prisma.Decimal(-22.9068),
          longitude: new Prisma.Decimal(-43.1729),
          localClimate: 'Tropical',
          timeZone: 'BRT',
          images: [],
        },
      ];
      prismaMock.destination.findMany.mockResolvedValue(mockDestinations);

      const mockExpectedDestinations = [
        { id: 1, title: 'Paris', imageUrl: '/uploads/paris.jpg' },
        { id: 2, title: 'Rio de Janeiro', imageUrl: null },
      ];
      const destinations = await homeService.findDestinations();

      expect(destinations).toEqual(mockExpectedDestinations);
      expect(prismaMock.destination.findMany).toHaveBeenCalledWith({
        where: {},
        select: {
          id: true,
          title: true,
          images: {
            take: 1,
            select: {
              url: true,
            },
          },
        },
        orderBy: {
          title: 'asc',
        },
      });
    });

    it('deve retornar os destinos filtrados, quando search tem uma string alfabética', async () => {
      const search = 'P';
      const mockResponse = [
        {
          id: 1,
          title: 'Paris',
          locationName: 'França',
          description: 'City of Light',
          latitude: new Prisma.Decimal(48.8566),
          longitude: new Prisma.Decimal(2.3522),
          localClimate: 'Temperate',
          timeZone: 'CET',
          images: [{ url: '/uploads/paris.jpg' }],
        },
        {
          id: 3,
          title: 'Porto',
          locationName: 'Portugal',
          description: 'Beautiful Portuguese city',
          latitude: new Prisma.Decimal(41.1579),
          longitude: new Prisma.Decimal(-8.6291),
          localClimate: 'Mediterranean',
          timeZone: 'WET',
          images: [{ url: '/uploads/porto.jpg' }],
        },
      ];

      prismaMock.destination.findMany.mockResolvedValue(mockResponse);

      const mockExpectedResult = [
        { id: 1, title: 'Paris', imageUrl: '/uploads/paris.jpg' },
        { id: 3, title: 'Porto', imageUrl: '/uploads/porto.jpg' },
      ];
      const destinations = await homeService.findDestinations(search);

      expect(destinations).toHaveLength(2);
      expect(destinations).toEqual(mockExpectedResult);

      expect(prismaMock.destination.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
          select: {
            id: true,
            title: true,
            images: {
              take: 1,
              select: {
                url: true,
              },
            },
          },
          orderBy: {
            title: 'asc',
          },
        })
      );
    });

    it('deve retornar destinos correspondentes ignorando letras maiusculas e minusculas', async () => {
      const search = 'pARiS';
      const mockResponse = [
        {
          id: 1,
          title: 'Paris',
          locationName: 'France',
          description: 'City of Light',
          latitude: new Prisma.Decimal(48.8566),
          longitude: new Prisma.Decimal(2.3522),
          localClimate: 'Temperate',
          timeZone: 'CET',
          images: [{ url: '/uploads/paris.jpg' }],
        },
      ];
      prismaMock.destination.findMany.mockResolvedValue(mockResponse);

      const mockExpectedResult = [{ id: 1, title: 'Paris', imageUrl: '/uploads/paris.jpg' }];

      const destinations = await homeService.findDestinations(search);

      expect(destinations).toEqual(mockExpectedResult);

      expect(prismaMock.destination.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            title: {
              contains: search,
              mode: 'insensitive',
            },
          },
        })
      );
    });

    it('deve tratar uma busca com apenas espaços(string vazia que gera falsy) como uma busca sem filtro', async () => {
      const mockDestinations = [
        {
          id: 1,
          title: 'Paris',
          locationName: 'France',
          description: 'City of Light',
          latitude: new Prisma.Decimal(48.8566),
          longitude: new Prisma.Decimal(2.3522),
          localClimate: 'Temperate',
          timeZone: 'CET',
          images: [{ url: '/uploads/paris.jpg' }],
        },
        {
          id: 2,
          title: 'Rio de Janeiro',
          locationName: 'Brasil',
          description: 'Marvelous City',
          latitude: new Prisma.Decimal(-22.9068),
          longitude: new Prisma.Decimal(-43.1729),
          localClimate: 'Tropical',
          timeZone: 'BRT',
          images: [{ url: '/uploads/riodejaneiro.jpg' }],
        },
      ];
      prismaMock.destination.findMany.mockResolvedValue(mockDestinations);

      await homeService.findDestinations(' ');

      expect(prismaMock.destination.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {},
        })
      );
    });
  });
  describe('funcao: getDestinationById()', () => {
    it('deve retornar o objeto completo de um destino com a imagem inclusa quando o ID é encontrado', async () => {
      const mockDestination = {
        id: 4,
        title: 'Brasilia',
        locationName: 'Brasil',
        description: 'A capital do Brasil.',
        latitude: new Prisma.Decimal(51.503),
        longitude: new Prisma.Decimal(17.122),
        localClimate: 'tropical',
        timeZone: 'GMT-3',
        itineraries: [],
        reviews: [],
        localEvents: [],
        survivalTips: [],
        recommendedActivities: [],
        images: [
          {
            id: 4,
            url: '/uploads/brasilia.jpg',
          },
          {
            id: 5,
            url: '/uploads/brasilia-catedral.jpg',
          },
        ],
      };

      prismaMock.destination.findUnique.mockResolvedValue(mockDestination);

      const destination = await homeService.getDestinationById(4);

      expect(destination).toEqual(mockDestination);

      expect(prismaMock.destination.findUnique).toHaveBeenCalledWith({
        where: { id: 4 },
        include: {
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });
    });

    it('deve retornar null quando o destino com o ID fornecido não existe', async () => {
      prismaMock.destination.findUnique.mockResolvedValue(null);

      const destination = await homeService.getDestinationById(777);

      expect(destination).toBeNull();
      expect(prismaMock.destination.findUnique).toHaveBeenCalledWith({
        where: { id: 777 },
        include: {
          images: {
            select: {
              id: true,
              url: true,
            },
          },
        },
      });
    });
  });
});
