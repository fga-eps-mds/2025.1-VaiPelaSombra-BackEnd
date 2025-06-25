import { prismaMock } from '../data/prismaMock';
import { HomeService } from '../services/home.service';

const homeService = new HomeService();

describe('Testes para HomeService', () => {
  describe('funcao: findDestinations()', () => {
    it('deve retornar todos destinos quando search está vazio(undfined)', async () => {
      const mockDestinations = [
        { id: 1, title: 'Paris' },
        { id: 2, title: 'Rio de Janeiro' },
      ];
      prismaMock.destination.findMany.mockResolvedValue(mockDestinations);

      const destinations = await homeService.findDestinations();

      expect(destinations).toHaveLength(2);
      expect(destinations[0].title).toBe('Paris');
      expect(destinations[0].id).toBe(1);
      expect(destinations).toEqual(mockDestinations);

      expect(prismaMock.destination.findMany).toHaveBeenCalledWith({
        where: {},
        select: {
          id: true,
          title: true,
        },
        orderBy: {
          title: 'asc',
        },
      });
    });

    it('deve retornar os destinos filtrados, quando search tem uma string alfabética', async () => {
      const search = 'P';
      const mockExpectedResult = [
        { id: 1, title: 'Paris' },
        { id: 3, title: 'Porto' },
      ];

      prismaMock.destination.findMany.mockResolvedValue(mockExpectedResult);

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
          },
          orderBy: {
            title: 'asc',
          },
        })
      );
    });

    it('deve tratar uma busca com apenas espaços(string vazia que gera falsy) como uma busca sem filtro', async () => {
      const mockDestinations = [
        { id: 1, title: 'Paris' },
        { id: 2, title: 'Rio de Janeiro' },
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
    it('deve retornar o objeto completo de um destino quando o ID é encontrado', async () => {
      const mockDestination = {
        id: 4,
        title: 'Brasilia',
        description: 'A capital do Brasil.',
        latitude: '51.503',
        longitude: '17.122',
        localClimate: 'tropical',
        timeZone: 'GMT-3',
        itineraries: [],
        reviews: [],
        localEvents: [],
        survivalTips: [],
        recommendedActivities: [],
      };

      prismaMock.destination.findUnique.mockResolvedValue(mockDestination);

      const destination = await homeService.getDestinationById(4);

      expect(destination).toEqual(mockDestination);

      expect(prismaMock.destination.findUnique).toHaveBeenCalledWith({
        where: { id: 4 },
      });
    });

    it('deve retornar null quando o destino com o ID fornecido não existe', async () => {
      prismaMock.destination.findUnique.mockResolvedValue(null);

      const destination = await homeService.getDestinationById(777);

      expect(destination).toBeNull();
      expect(prismaMock.destination.findUnique).toHaveBeenCalledWith({ where: { id: 777 } });
    });
  });
});
