import { Request, Response } from 'express';
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

export class DestinationsController {
  async getAllDestinations(req: Request, res: Response):Promise<void>  {
    try {
      const { search } = req.query; 

      let whereClause = {}; 

      if (search) {
        whereClause = {
          name: {
            contains: String(search), 
            mode: 'insensitive',    
          },
        };
      }

      const destinations = await prisma.destination.findMany({
        where: whereClause, 
        include: {
          images: true,
        },
      });

      res.status(200).json(destinations);
    } catch (error) {
      console.error('Erro ao buscar destinos:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }


  async getDestinationById(req: Request, res: Response):Promise<void>  {
    try {
      const { id } = req.params;
      const destination = await prisma.destination.findUnique({
        where: { id: String(id) },
        include: {
          images: true,
        },
      });

      if (!destination) {
        res.status(404).json({ message: 'Destino não encontrado.' });
      }

      res.status(200).json(destination);
    } catch (error) {
      console.error('Erro ao buscar destino por ID:', error);
      res.status(500).json({ message: 'Erro interno do servidor.' });
    }
  }


}