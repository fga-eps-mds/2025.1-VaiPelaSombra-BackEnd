import { Request, Response } from 'express';
import { CreateDestinationSchema, UpdateDestinationSchema } from '../dtos/destination.dto';
import { BadRequestError, NotFoundError } from '../errors/httpError';
import { DestinationImageDTO, destinationImageSchema } from '../dtos/destinationImage.dto';
import { validateMIMEType } from 'validate-image-type';
import fs from 'fs/promises';
import { DestinationService } from '../services/destination.service';
export class DestinationController {
  constructor(private destinationService: DestinationService) {}
  createDestination = async (req: Request, res: Response) => {
    const data = CreateDestinationSchema.parse(req.body);
    const destination = await this.destinationService.create(data);
    res.status(201).json(destination);
  };
  deleteDestination = async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId) || destinationId <= 0)
      throw new BadRequestError('Invalid destination id');
    const deletedDestination = await this.destinationService.deleteDestination(destinationId);
    res.status(200).json(deletedDestination);
  };
  updateDestination = async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId) || destinationId <= 0)
      throw new BadRequestError('Invalid destination id');
    const data = UpdateDestinationSchema.parse(req.body);
    const updatedDestination = await this.destinationService.update(destinationId, data);
    res.status(200).json(updatedDestination);
  };
  getAllDestinations = async (req: Request, res: Response) => {
    const destinations = await this.destinationService.getAllDestinations();
    res.status(200).json(destinations);
  };
  getDestinationById = async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId) || destinationId <= 0)
      throw new BadRequestError('Invalid destination id');
    const destination = await this.destinationService.getDestinationById(destinationId);
    if (!destination) {
      throw new NotFoundError('Destination not found');
    }
    res.status(200).json(destination);
  };

  uploadDestinationImage = async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId) || destinationId <= 0)
      throw new BadRequestError('Invalid destination id');
    if (!req.file) throw new BadRequestError('No image file provided');
    let imageFile: DestinationImageDTO;
    try {
      imageFile = destinationImageSchema.parse(req.file);
    } catch (error) {
      await fs.unlink(req.file.path).catch(() => {});
      throw error;
    }
    const result = await validateMIMEType(req.file.path, {
      originalFilename: req.file.originalname,
      allowMimeTypes: ['image/jpeg', 'image/png'],
    });
    if (!result.ok) {
      await fs.unlink(req.file.path).catch(() => {});
      throw new BadRequestError('Invalid image type. Only JPEG and PNG are allowed.');
    }
    const savedImage = await this.destinationService.uploadDestinationImage(
      destinationId,
      imageFile
    );
    res.status(201).json(savedImage);
  };
  getDestinationImages = async (req: Request, res: Response) => {
    const destinationId = parseInt(req.params.destinationId);
    if (isNaN(destinationId) || destinationId <= 0)
      throw new BadRequestError('Invalid destination id');
    const images = await this.destinationService.getDestinationImages(destinationId);
    res.status(200).json(images);
  };
}
