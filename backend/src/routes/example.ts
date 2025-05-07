import { Router } from 'express';
import { ExampleController } from '../controllers/example';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Example
 *   description: Example API endpoints
 */

/**
 * @swagger
 * /example:
 *   get:
 *     summary: Returns a welcome message
 *     tags: [Example]
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
router.get('/', ExampleController.getExample);

export default router;
