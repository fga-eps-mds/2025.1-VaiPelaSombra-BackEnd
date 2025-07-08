import { Resend } from 'resend';
import { render } from '@react-email/render';
import AccessTokenEmail from '../utils/emaiLayout';
import { UserService } from './user.service';

// const resend = new Resend(process.env.RESEND_API_KEY);
// const resend = new Resend('re_PFyc4WX5_CgxTCiRyQ8UyvvLKMF4Tqck3'); // Use your actual Resend API key here
const resend = new Resend('re_317K4kWX_7ho7VkmafzgZacvxDLMC1Bq6'); // Renann basico 

const userService = new UserService();

class EmailService {
  public async sendRecoveryEmail(userEmail: string): Promise<void> {
    const novaSenha = Array.from({ length: 12 }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');
    const user = await userService.findByEmail(userEmail);
    console.log('User found:', user);

    if (!user) {
      throw new Error('Usuário com este e-mail não foi encontrado.');
    }

    const recoveryLink = `http://localhost:5174/recover-password?userId=${user.id}`;

    user.password = novaSenha
    userService.update(user.id, {
        password: user.password,
      }
    )

    const emailHtml = await render(AccessTokenEmail({ email: userEmail, novaSenha: novaSenha, link: recoveryLink }));
    user.password = novaSenha
    userService.update(user.id, {
        password: user.password,
      }
    )

    const { data, error } = await resend.emails.send({
      
      from: 'Seu App <onboarding@resend.dev>',
      // from: 'Vai Pela Sombra <vaipelasombra@contato.com>',
      // to: [userEmail],
      to: ["renannpop11@gmail.com"],
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
