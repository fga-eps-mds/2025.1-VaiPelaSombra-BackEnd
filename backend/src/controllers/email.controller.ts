import { NextFunction, Request, Response } from 'express';
import { emailService } from '../services/email.service';
import { BadRequestError } from '../errors/httpError';

export const sendRecoveryEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      throw new BadRequestError('O parâmetro "email" é obrigatório.');
    }

    await emailService.sendRecoveryEmail(email);
    return res.status(200).json({
      message: 'Se um usuário com este e-mail existir, um link de recuperação foi enviado.',
    });
  } catch (error) {
    next(error);
  }
};
