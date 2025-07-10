import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { AuthService } from '../services/auth.service';
const authService = new AuthService();
const authController = new AuthController(authService);
const router = Router();

router.post('/refresh', authController.refreshAccessToken);
router.post('/logout', authController.logout);
router.post('/login', authController.login);

export default router;
