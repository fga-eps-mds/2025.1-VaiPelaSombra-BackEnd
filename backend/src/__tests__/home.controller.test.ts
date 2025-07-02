import { Prisma } from '../generated/prisma';
import request from 'supertest';
import app from '../app';
import { HomeService } from '../services/home.service';

describe('Testes de integração para HomeController', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET /home', () => {
    it('deve retornar status 200 e a lista de destinos', async () => {
      const mockApiResponse = [
        { id: 1, title: 'Paris', imageUrl: '/uploads/paris.jpg' },
        { id: 2, title: 'Rio de Janeiro', imageUrl: null },
      ];

      jest.spyOn(HomeService.prototype, 'findDestinations').mockResolvedValue(mockApiResponse);

      const response = await request(app).get('/home');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockApiResponse);
    });

    it('deve retornar status 500 se o service retornar um erro', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

      jest
        .spyOn(HomeService.prototype, 'findDestinations')
        .mockRejectedValue(new Error('Erro de banco de dados'));

      const response = await request(app).get('/home');

      expect(response.status).toBe(500);
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('GET /home/:id', () => {
    it('deve retornar status 200 e o destino determinado pelo id', async () => {
      const mockServiceResponse = {
        id: 4,
        title: 'Brasilia',
        description: 'A capital do Brasil',
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
        ],
      };

      const mockApiResponse = {
        id: 4,
        title: 'Brasilia',
        description: 'A capital do Brasil',
        latitude: '51.503',
        longitude: '17.122',
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
        ],
      };

      jest
        .spyOn(HomeService.prototype, 'getDestinationById')
        .mockResolvedValue(mockServiceResponse);

      const response = await request(app).get('/home/4');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockApiResponse);
    });

    it('deve retornar status 404 se o destino não for encontrado', async () => {
      jest.spyOn(HomeService.prototype, 'getDestinationById').mockResolvedValue(null);

      const response = await request(app).get('/home/777');

      expect(response.status).toBe(404);
    });

    it('deve retornar status 400 se o id for inválido', async () => {
      const response = await request(app).get('/home/abc');

      expect(response.status).toBe(400);
    });
  });
});
