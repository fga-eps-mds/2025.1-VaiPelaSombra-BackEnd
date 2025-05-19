import { Router } from 'express';
import { PlanoViagemController } from '../controllers/planoViagem.controller';

const router = Router();

router.get('/:userId', PlanoViagemController.getAllPlanosViagem);
router.get('/:userId/:id', PlanoViagemController.getPlanoViagemById);
router.post('/:userId', PlanoViagemController.createPlanoViagem);
router.delete('/:userId/:id', PlanoViagemController.deletePlanoViagem);
router.put('/:userId/:id', PlanoViagemController.updatePlanoViagem);

export default router;