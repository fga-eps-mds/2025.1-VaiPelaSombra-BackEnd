import { RequestHandler } from 'express';
import { loginService } from '../services/login.service';

export const loginController: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required.' });
    return;
  }

  try {
    const result = await loginService.authenticateUser(email, password);
    res.status(200).json(result);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Email ou senha inválidos') {
      res.status(401).json({ message: 'Incorrect email or password.' });
      return;
    }

    res.status(500).json({ message: 'Internal server error.' });
  }
};
