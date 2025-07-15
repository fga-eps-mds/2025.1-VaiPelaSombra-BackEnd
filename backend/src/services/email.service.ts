import { UserService } from './user.service';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

const userService = new UserService();

export class EmailService {
  public async sendRecoveryEmail(userEmail: string): Promise<void> {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      secure: true,
      auth: {
        user: 'vaipelasombra102@gmail.com',
        pass: 'taho bjvz ivyr pyxb',
      },
    });

    const novaSenha = Array.from({ length: 12 }, () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
      return chars.charAt(Math.floor(Math.random() * chars.length));
    }).join('');

    const criptedPassword = await bcrypt.hash(novaSenha, 10);
    const user = await userService.findByEmail(userEmail);
    console.log('User found:', user);

    if (!user) {
      throw new Error('Usuário com este e-mail não foi encontrado.');
    }

    const recoveryLink = `http://localhost:5174/recover-password?userId=${user.id}`;

    try {
      const emailHtml = `
        <html>
          <body style="background:#f5f6fa;padding:40px 0;">
            <div style="max-width:400px;margin:40px auto;background:#fff;border-radius:8px;box-shadow:0 2px 8px #0001;padding:32px 24px 24px 24px;text-align:center;font-family:sans-serif;">
              <h2 style="margin-bottom:16px;color:#222;">Recuperação de Senha</h2>
              <p style="margin-bottom:24px;font-size:16px;color:#444;">
                Olá!<br><br>
                Recebemos uma solicitação redefinir a sua senha. 
                Para isso acessa a sua conta usando essa senha temporaria: <br><b style='font-size:18px;'>${novaSenha}</b><br>
                Realize o login e defina uma nova senha de sua preferência.<br>
              </p>
              <a href="${recoveryLink}" style="display:inline-block;padding:12px 32px;background:#1976d2;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;font-size:16px;">LOGIN</a>
            </div>
          </body>
        </html>
      `;

      await transporter.sendMail({
        from: 'VaiPelaSombra <vaipelasombra102@gmail.com>',
        to: userEmail,
        subject: 'Recuperação de Senha',
        html: emailHtml,
      });

      user.password = criptedPassword;
      userService.update(user.id, {
        password: user.password,
      });
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
    }
    console.log(`E-mail de recuperação enviado com sucesso para ${userEmail}.`);
  }
}

export const emailService = new EmailService();
