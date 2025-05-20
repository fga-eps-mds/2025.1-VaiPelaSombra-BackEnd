import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { UserPreferencesController } from '../controllers/userPreferences.controller';
import { TravelInterestsController } from '../controllers/travelInterests.controller';
const router = Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         age:
 *           type: number
 *           description: The user's age
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john.doe@example.com
 *         age: 30
 *         createdAt: 2023-05-01T10:00:00Z
 *         updatedAt: 2023-05-01T10:00:00Z
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     responses:
 *       200:
 *         description: A list of users
 */
router.get('/', (req, res) => UserController.getAllUsers(req, res));

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the user
 *         name:
 *           type: string
 *           description: The user's name
 *         email:
 *           type: string
 *           description: The user's email
 *         age:
 *           type: number
 *           description: The user's age
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date the user was last updated
 *       example:
 *         id: d5fE_asz
 *         name: John Doe
 *         email: john.doe@example.com
 *         age: 30
 *         createdAt: 2023-05-01T10:00:00Z
 *         updatedAt: 2023-05-01T10:00:00Z
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
router.get('/', (req, res) => UserController.getAllUsers(req, res));

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Retrieve a single user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: A single user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.get('/:id', (req, res) => UserController.getUserById(req, res));

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.post('/', (req, res) => UserController.createUser(req, res));

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update an existing user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The user was successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
router.put('/:id', (req, res) => UserController.updateUser(req, res));

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: The user was successfully deleted
 */
router.delete('/:id', (req, res) => UserController.deleteUser(req, res));

/**
 * @swagger
 * /users/{id}/preferences:
 *   get:
 *     summary: Retrieve travel preferences for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The user ID
 *     responses:
 *       200:
 *         description: Travel preferences for the user
 */
router.get('/:id/preferences', UserPreferencesController.getUserTravelPreferencesByUserId);

/**
 * @swagger
 * /users/{id}/preferences:
 *   post:
 *     summary: Save or update a user's travel preferences
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelPreferences:
 *                 type: object
 *                 properties:
 *                   travelerType:
 *                     type: string
 *                     enum: [AVENTUREIRO, CULTURAL, RELAXAMENTO, GASTRONOMICO]
 *                     example: AVENTUREIRO
 *                   travelFrequency:
 *                     type: string
 *                     enum: [BIMESTRAL, TRIMESTRAL, SEMESTRAL, ANUAL]
 *                     example: ANUAL
 *                   averageBudget:
 *                     type: number
 *                     example: 0
 *     responses:
 *       200:
 *         description: Preferences saved successfully
 */

router.post('/:id/preferences', UserPreferencesController.saveUserTravelPreferences);
/**
 * @swagger
 * /users/{id}/preferences:
 *   put:
 *     summary: Update a user's travel preferences
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelPreferences:
 *                 type: object
 *                 properties:
 *                   travelerType:
 *                     type: string
 *                     enum: [AVENTUREIRO, CULTURAL, RELAXAMENTO, GASTRONOMICO]
 *                     example: RELAXAMENTO
 *                   travelFrequency:
 *                     type: string
 *                     enum: [BIMESTRAL, TRIMESTRAL, SEMESTRAL, ANUAL]
 *                     example: SEMESTRAL
 *                   averageBudget:
 *                     type: number
 *                     example: 3500
 *     responses:
 *       200:
 *         description: Preferences updated successfully
 *       404:
 *         description: Preferences not found
 *       400:
 *         description: Invalid input
 */

router.put('/:id/preferences', UserPreferencesController.saveUserTravelPreferences);
/**
 * @swagger
 * /users/{id}/interests:
 *   get:
 *     summary: Get travel interests selected by a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: List of travel interests selected by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 2
 *                   name:
 *                     type: string
 *                     example: CULTURAL
 *       404:
 *         description: Preferences not found
 */

router.get('/:id/interests', TravelInterestsController.getUserTravelInterestsByUserId);
/**
 * @swagger
 * /users/{id}/interests:
 *   post:
 *     summary: Save travel interests for a user (first-time setup)
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelInterestsIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 3, 4]
 *     responses:
 *       201:
 *         description: Interests saved successfully
 *       400:
 *         description: No interests selected
 */

router.post('/:id/interests', TravelInterestsController.saveUserTravelInterests);
/**
 * @swagger
 * /users/{id}/interests:
 *   put:
 *     summary: Update travel interests for a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               travelInterestsIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [2, 4, 5]
 *     responses:
 *       200:
 *         description: Interests updated successfully
 *       400:
 *         description: No interests selected
 *       404:
 *         description: Preferences not found
 */

router.put('/:id/interests', TravelInterestsController.saveUserTravelInterests);
export default router;
