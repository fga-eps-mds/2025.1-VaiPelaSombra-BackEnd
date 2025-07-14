import { Request, Response,NextFunction } from 'express';
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
   async toggleDestinationFavorite(req: Request, res: Response, next: NextFunction) {
        const { destinationId } = req.params;
        const { isFavorited } = req.body; // Supondo que o frontend envia { isFavorited: true/false }

        // Validação do ID do destino
        if (isNaN(Number(destinationId))) {
            // Use o seu sistema de erros ou retorne um erro Bad Request
            // return next(new BadRequestError('ID do destino inválido.'));
            return next(new Error('ID do destino inválido.'));
        }

        // Validação do payload (se isFavorited é um booleano)
        if (typeof isFavorited !== 'boolean') {
            // return next(new BadRequestError('O campo isFavorited é obrigatório e deve ser um booleano.'));
            return next(new Error('O campo isFavorited é obrigatório e deve ser um booleano.'));
        }

        try {
            // Aqui você chamaria um método no seu DestinationService
            // que lida com a lógica de marcar/desmarcar como favorito.
            // Este método no service precisaria de:
            // 1. O destinationId
            // 2. O estado `isFavorited` (true para favoritar, false para desfavoritar)
            // 3. O ID do usuário (se a funcionalidade de favorito for por usuário)

            // Exemplo (você precisará implementar 'toggleFavoriteStatus' no seu service):
            // Assumindo que você tem acesso ao usuário autenticado via req.user (se usar autenticação)
            // const userId = (req as any).user?.id; // Ajuste conforme sua implementação de autenticação
            // if (!userId) {
            //     return next(new Error('Usuário não autenticado.'));
            // }

            const updatedFavoriteStatus = await this.destinationService.toggleFavoriteStatus(
                Number(destinationId),
                isFavorited
                // userId // Passe o userId se necessário
            );

            res.status(200).json({ 
                message: isFavorited ? 'Destino adicionado aos favoritos.' : 'Destino removido dos favoritos.',
                isFavorited: updatedFavoriteStatus // Opcional: retornar o status atualizado
            });

        } catch (error) {
            console.error("Erro ao favoritar/desfavoritar destino:", error); // Log para depuração
            next(error); // Encaminha o erro para o middleware de tratamento de erros
        }
    }
}