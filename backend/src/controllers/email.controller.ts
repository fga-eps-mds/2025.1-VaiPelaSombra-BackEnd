import { emailService } from '../services/email.service';
import { BadRequestError } from '../errors/httpError';
import { RequestHandler } from 'express';

export const sendRecoveryEmail: RequestHandler = async (req, res, next) => {
  try {
    console.log('sendRecoveryEmail called with query:', req.query);
    const { email } = req.query;
    if (!email || typeof email !== 'string') {
      throw new BadRequestError('O parâmetro "email" é obrigatório.');
    }

    await emailService.sendRecoveryEmail(email);

    res.status(200).json({
      message: 'Se um usuário com este e-mail existir, um link de recuperação foi enviado.',
    });
  } catch (error) {
    next(error);
  }
};
