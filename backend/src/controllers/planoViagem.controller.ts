import { Request, Response } from 'express';
import { PlanoViagemService } from '../services/planoViagem.service';

export const PlanoViagemController = {
  getAllPlanosViagem: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const planos = await PlanoViagemService.getAllPlanosViagemByUserId(userId);
      res.status(200).json(planos);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar planos de viagem', error });
    }
  },

  getPlanoViagemById: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const id = parseInt(req.params.id, 10);
      const plano = await PlanoViagemService.getPlanoViagemById(userId, id);

      if (!plano) {
        res.status(404).json({ message: 'Plano de viagem não encontrado' });
        return;
      }

      res.status(200).json(plano);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao buscar plano de viagem', error });
    }
  },

  createPlanoViagem: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const newPlano = req.body;
      const plano = await PlanoViagemService.createPlanoViagem(userId, newPlano);
      res.status(201).json(plano);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao criar plano de viagem', error });
    }
  },

  updatePlanoViagem: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const id = parseInt(req.params.id, 10);
      const updatedData = req.body;
      const updatedPlano = await PlanoViagemService.updatePlanoViagem(userId, id, updatedData);

      if (!updatedPlano) {
        res.status(404).json({ message: 'Plano de viagem não encontrado para atualização' });
        return;
      }

      res.status(200).json(updatedPlano);
    } catch (error) {
      res.status(500).json({ message: 'Erro ao atualizar plano de viagem', error });
    }
  },

  deletePlanoViagem: async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.userId, 10);
      const id = parseInt(req.params.id, 10);
      const deleted = await PlanoViagemService.deletePlanoViagem(userId, id);

      if (!deleted) {
        res.status(404).json({ message: 'Plano de viagem não encontrado para exclusão' });
        return;
      }

      res.status(200).json({ message: 'Plano de viagem excluído com sucesso' });
    } catch (error) {
      res.status(500).json({ message: 'Erro ao excluir plano de viagem', error });
    }
  },
};
