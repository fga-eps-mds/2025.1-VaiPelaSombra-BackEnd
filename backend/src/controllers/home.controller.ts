import { Request, Response } from 'express';
import { HomeService } from '../services/home.service';

const homeService = new HomeService();

export const handleFindDestinations = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;

    const destinations = await homeService.findDestinations(
      typeof search === 'string' ? search : undefined
    );

    res.status(200).json(destinations);
  } catch (error) {
    console.error('Error fetching destinations:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

export const handleGetDestinationById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid destination ID.' });
      return;
    }

    const destination = await homeService.getDestinationById(id);

    if (!destination) {
      res.status(404).json({ message: 'Destination not found.' });
      return;
    }

    res.status(200).json(destination);
  } catch (error) {
    console.error('Error fetching destination by ID:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};
