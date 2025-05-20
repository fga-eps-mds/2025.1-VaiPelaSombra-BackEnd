import { Router } from 'express';
import { PlanoViagemController } from '../controllers/planoViagem.controller';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: planoViagem
 *   description: API para gerenciar planos de viagem
 */

/**
 * @swagger
 * /planoViagem:
 *   get:
 *     summary: Retorna uma mensagem de boas-vindas para o PlanoViagem
 *     tags: [PlanoViagem]
 *     responses:
 *       200:
 *         description: Uma mensagem de boas-vindas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Bem-vindo à API de PlanoViagem!"
 */
router.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API de PlanoViagem!' });
});

/**
 * @swagger
 * /planoViagem/{userId}:
 *   get:
 *     summary: Retorna todos os planos de viagem de um usuário
 *     tags: [PlanoViagem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     responses:
 *       200:
 *         description: Lista de planos de viagem
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PlanoViagem'
 *       404:
 *         description: Usuário não encontrado
 */
router.get('/:userId', (req, res) => PlanoViagemController.getAllPlanosViagem(req, res));

/**
 * @swagger
 * /planoViagem/{userId}/{id}:
 *   get:
 *     summary: Retorna um plano de viagem específico
 *     tags: [PlanoViagem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de viagem
 *     responses:
 *       200:
 *         description: Detalhes do plano de viagem
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PlanoViagem'
 *       404:
 *         description: Plano de viagem não encontrado
 */
router.get('/:userId/:id', (req, res) => PlanoViagemController.getPlanoViagemById(req, res));

/**
 * @swagger
 * /planoViagem/{userId}:
 *   post:
 *     summary: Cria um novo plano de viagem
 *     tags: [PlanoViagem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanoViagem'
 *     responses:
 *       201:
 *         description: Plano de viagem criado com sucesso
 *       400:
 *         description: Dados inválidos
 */
router.post('/:userId', (req, res) => PlanoViagemController.createPlanoViagem(req, res));

/**
 * @swagger
 * /planoViagem/{userId}/{id}:
 *   put:
 *     summary: Atualiza um plano de viagem existente
 *     tags: [PlanoViagem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de viagem
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlanoViagem'
 *     responses:
 *       200:
 *         description: Plano de viagem atualizado com sucesso
 *       404:
 *         description: Plano de viagem não encontrado
 */
router.put('/:userId/:id', (req, res) => PlanoViagemController.updatePlanoViagem(req, res));

/**
 * @swagger
 * /planoViagem/{userId}/{id}:
 *   delete:
 *     summary: Exclui um plano de viagem
 *     tags: [PlanoViagem]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuário
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do plano de viagem
 *     responses:
 *       200:
 *         description: Plano de viagem excluído com sucesso
 *       404:
 *         description: Plano de viagem não encontrado
 */
router.delete('/:userId/:id', (req, res) => PlanoViagemController.deletePlanoViagem(req, res));

export default router;
