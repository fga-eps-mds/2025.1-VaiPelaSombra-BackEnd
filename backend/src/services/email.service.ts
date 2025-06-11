import { Resend } from 'resend';
import { render } from '@react-email/render';
import AccessTokenEmail from '../emails/emaiLayout';
import { UserService } from './user.service';

const resend = new Resend(process.env.RESEND_API_KEY);

const userService = new UserService();

class EmailService {
  public async sendRecoveryEmail(userEmail: string): Promise<void> {
    const user = await userService.findByEmail(userEmail);

    if (!user) {
      throw new Error('Usuário com este e-mail não foi encontrado.');
    }

    const recoveryLink = `http://localhost:5174/reset-password?userId=${user.id}`;

    const emailHtml = await render(AccessTokenEmail({ email: userEmail, link: recoveryLink }));

    const { data, error } = await resend.emails.send({
      from: 'Seu App <onboarding@resend.dev>',
      to: [userEmail],
      subject: 'Seu link para recuperação de conta',
      html: emailHtml,
    });

    if (error) {
      console.error({ error });
      throw new Error('Falha ao enviar o e-mail de recuperação.');
    }

    console.log(`E-mail de recuperação enviado com sucesso para ${userEmail}.`, { data });
  }
}

export const emailService = new EmailService();
