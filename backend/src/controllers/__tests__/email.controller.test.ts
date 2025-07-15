import { sendRecoveryEmail } from '../../controllers/email.controller';
import { emailService } from '../../services/email.service';
import { BadRequestError } from '../../errors/httpError';
import { Request, Response, NextFunction } from 'express';

jest.mock('../../services/email.service', () => ({
  emailService: {
    sendRecoveryEmail: jest.fn(),
  },
}));

describe('sendRecoveryEmail', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {
      query: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should send recovery email when email is valid', async () => {
    req.query = { email: 'test@example.com' };

    await sendRecoveryEmail(req as Request, res as Response, next);

    expect(emailService.sendRecoveryEmail).toHaveBeenCalledWith('test@example.com');
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Se um usuário com este e-mail existir, um link de recuperação foi enviado.',
    });
  });

  it('should call next with BadRequestError if email is missing', async () => {
    req.query = {};

    await sendRecoveryEmail(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    expect(emailService.sendRecoveryEmail).not.toHaveBeenCalled();
  });

  it('should call next with BadRequestError if email is not a string', async () => {
    req.query = { email: 123 as any };

    await sendRecoveryEmail(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    expect(emailService.sendRecoveryEmail).not.toHaveBeenCalled();
  });

  it('should call next with error if emailService throws', async () => {
    req.query = { email: 'fail@example.com' };
    (emailService.sendRecoveryEmail as jest.Mock).mockRejectedValue(new Error('Service error'));

    await sendRecoveryEmail(req as Request, res as Response, next);

    expect(emailService.sendRecoveryEmail).toHaveBeenCalledWith('fail@example.com');
    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});
