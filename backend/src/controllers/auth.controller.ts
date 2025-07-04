import { AuthService } from '../services/auth.service';
import { Request, Response } from 'express';
export class AuthController {
  constructor(private authService: AuthService) {}
  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ message: 'Email and password are required.' });
      return;
    }
    const result = await this.authService.login(email, password);
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
    res.status(200).json({
      accessToken: result.accessToken,
      user: result.user,
    });
  };
  logout = async (req: Request, res: Response) => {
    await this.authService.logout();
    res.clearCookie('refreshToken');
    res.status(200).send();
    return;
  };

  refreshAccessToken = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      res.status(401).json({ message: 'Refresh token required' });
      return;
    }

    const accessToken = await this.authService.refreshToken(refreshToken);
    res.json(accessToken);
  };
}
