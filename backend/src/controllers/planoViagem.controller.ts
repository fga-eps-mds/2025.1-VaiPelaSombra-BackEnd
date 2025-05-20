import { Request, Response } from 'express';
import { PlanoViagemService } from '../services/planoViagem.service';

export const PlanoViagemController = {
  getAllPlanosViagem: (req: Request, res: Response): void => {
    const userId = parseInt(req.params.userId, 10);
    const planos = PlanoViagemService.getAllPlanosViagemByUserId(userId);
    res.status(200).json(planos);
  },

  getPlanoViagemById: (req: Request, res: Response): void => {
    const userId = parseInt(req.params.userId, 10);
    const id = parseInt(req.params.id, 10);
    const plano = PlanoViagemService.getPlanoViagemById(userId, id);

    if (!plano) {
      res.status(404).json({ message: 'Plano de viagem não encontrado' });
      return;
    }

    res.status(200).json(plano);
  },

  createPlanoViagem: (req: Request, res: Response): void => {
    const userId = parseInt(req.params.userId, 10);
    const newPlano = req.body;
    const plano = PlanoViagemService.createPlanoViagem(userId, newPlano);
    res.status(201).json(plano);
  },

  updatePlanoViagem: (req: Request, res: Response): void => {
    const userId = parseInt(req.params.userId, 10);
    const id = parseInt(req.params.id, 10);
    const updatedData = req.body;
    const updatedPlano = PlanoViagemService.updatePlanoViagem(userId, id, updatedData);

    if (!updatedPlano) {
      res.status(404).json({ message: 'Plano de viagem não encontrado para atualização' });
      return;
    }

    res.status(200).json(updatedPlano);
  },

  deletePlanoViagem: (req: Request, res: Response): void => {
    const userId = parseInt(req.params.userId, 10);
    const id = parseInt(req.params.id, 10);
    const deleted = PlanoViagemService.deletePlanoViagem(userId, id);

    if (!deleted) {
      res.status(404).json({ message: 'Plano de viagem não encontrado para exclusão' });
      return;
    }

    res.status(200).json({ message: 'Plano de viagem excluído com sucesso' });
  },
};
