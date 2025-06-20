import { prismaMock } from '../data/prismaMock';
import { HomeService } from '../services/home.service';

const homeService = new HomeService();

describe('Testes para Home Service', () => {
  //pra func findDestinations
  describe('funcao: findDestinations()', () => {
    it('deve retornar todos os destinos quando search está vazio(undfined)', async () => {
      const mockDestinations = [
        {
          id: 'uuid-1',
          name: 'Paris',
          description: 'Cidade da luz',
          mainImageUrl: '',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'uuid-2',
          name: 'Rio de Janeiro',
          description: 'Cidade maravilhosa',
          mainImageUrl: '',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaMock.homeDestination.findMany.mockResolvedValue(mockDestinations);
      const destinations = await homeService.findDestinations();
      expect(destinations).toHaveLength(2);
      expect(destinations[1].name).toBe('Rio de Janeiro');
      expect(prismaMock.homeDestination.findMany).toHaveBeenCalledWith({
        where: {},
        include: { images: true },
      });
    });

    it('deve retornar os destinos filtrados quando search envia uma string que não está vazia', async () => {
      const mockFiltered = [
        {
          id: 'uuid-1',
          name: 'Paris',
          description: 'Cidade da luz',
          mainImageUrl: '',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaMock.homeDestination.findMany.mockResolvedValue(mockFiltered);
      const searchQuery = 'Paris';
      const destinations = await homeService.findDestinations(searchQuery);
      expect(destinations).toHaveLength(1);
      expect(destinations[0].name).toBe('Paris');
      expect(prismaMock.homeDestination.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: searchQuery,
            mode: 'insensitive',
          },
        },
        include: { images: true },
      });
    });

    it('deve retornar todos os destinos se a search for uma string vazia', async () => {
      const mockDestinations = [
        {
          id: 'uuid-1',
          name: 'Paris',
          description: 'Cidade da luz',
          mainImageUrl: '',
          images: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      prismaMock.homeDestination.findMany.mockResolvedValue(mockDestinations);
      const destinations = await homeService.findDestinations('');

      expect(destinations).toEqual(mockDestinations);

      expect(prismaMock.homeDestination.findMany).toHaveBeenCalledWith({
        where: {},
        include: { images: true },
      });
    });
  });

  //pra func findDestinations
  describe('getDestinationById()', () => {
    it('deve retornar um destino especifico pelo seu id(string)', async () => {
      const mockDestination = {
        id: 'uuid-paris',
        name: 'Paris',
        description: 'Cidade da luz',
        mainImageUrl: '',
        images: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      prismaMock.homeDestination.findUnique.mockResolvedValue(mockDestination);
      const destination = await homeService.getDestinationById('uuid-paris');
      expect(destination).not.toBeNull();
      expect(destination?.name).toBe('Paris');
      expect(prismaMock.homeDestination.findUnique).toHaveBeenCalledWith({
        where: { id: 'uuid-paris' },
        include: { images: true },
      });
    });

    it('deve retornar null se o destino não for encontrado pelo id(string)', async () => {
      prismaMock.homeDestination.findUnique.mockResolvedValue(null);
      const destination = await homeService.getDestinationById('uuid-nao-existe');
      expect(destination).toBeNull();
    });
  });
});
