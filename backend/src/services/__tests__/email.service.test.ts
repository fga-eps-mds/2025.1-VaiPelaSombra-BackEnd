import bcrypt from 'bcrypt';
import { UserService } from '../user.service';
import { EmailService } from '../email.service';

jest.mock('bcrypt', () => ({
  hash: jest.fn(() => Promise.resolve('hashedPassword')),
}));

const mockSendMail = jest.fn();

jest.mock('nodemailer', () => ({
  createTransport: jest.fn(() => ({
    sendMail: mockSendMail,
  })),
}));

jest.mock('../user.service');

describe.skip('EmailService', () => {
  const mockUser = { id: 1, email: 'test@example.com', password: 'oldPassword' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should send recovery email and update user password', async () => {
    // mock antes de instanciar
    (UserService.prototype.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    (UserService.prototype.update as jest.Mock).mockResolvedValue(undefined);

    const emailService = new EmailService(); // <-- AQUI!

    await emailService.sendRecoveryEmail(mockUser.email);

    expect(UserService.prototype.findByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(bcrypt.hash).toHaveBeenCalled();
    expect(mockSendMail).toHaveBeenCalledWith(
      expect.objectContaining({
        to: mockUser.email,
        subject: 'Recuperação de Senha',
        html: expect.stringContaining('Recuperação de Senha'),
      })
    );
    expect(UserService.prototype.update).toHaveBeenCalledWith(mockUser.id, {
      password: 'hashedPassword',
    });
  });

  it('should throw error if user not found', async () => {
    (UserService.prototype.findByEmail as jest.Mock).mockResolvedValue(null);

    const emailService = new EmailService();

    await expect(emailService.sendRecoveryEmail(mockUser.email)).rejects.toThrow(
      'Usuário com este e-mail não foi encontrado.'
    );
  });

  it('should handle email sending errors gracefully', async () => {
    (UserService.prototype.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    mockSendMail.mockRejectedValueOnce(new Error('SMTP failure'));

    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();

    const emailService = new EmailService();

    await emailService.sendRecoveryEmail(mockUser.email);

    expect(mockSendMail).toHaveBeenCalled();
    expect(UserService.prototype.update).not.toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});
