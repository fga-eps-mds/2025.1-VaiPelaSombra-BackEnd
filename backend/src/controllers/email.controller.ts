import { Request, Response } from 'express';
import { emailService } from '../services/email.service';

class EmailController {
  public async handleSendRecoveryEmail(req: Request, res: Response): Promise<Response> {
    const { email } = req.query;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'O parâmetro "email" é obrigatório.' });
    }

    try {
      await emailService.sendRecoveryEmail(email);

      return res.status(200).json({
        message: 'Se um usuário com este e-mail existir, um link de recuperação foi enviado.',
      });
    } catch (error) {
      console.error('Falha no envio de e-mail de recuperação:', error);

      if (error instanceof Error && error.message.includes('não foi encontrado')) {
        return res.status(200).json({
          message: 'Se um usuário com este e-mail existir, um link de recuperação foi enviado.',
        });
      }

      // Para qualquer outro erro, retornamos erro 500
      return res
        .status(500)
        .json({ error: 'Ocorreu um erro interno ao processar a sua solicitação.' });
    }
  }
}

export const emailController = new EmailController();
