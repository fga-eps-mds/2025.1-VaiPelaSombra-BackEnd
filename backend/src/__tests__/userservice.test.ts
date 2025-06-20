import { UserService } from '../services/user.service'; // Ajuste o caminho conforme seu projeto
import { PrismaClient, Prisma } from '../generated/prisma';

jest.mock('../generated/prisma', () => {
  const mPrismaClient = {
    user: {
      delete: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient), Prisma: { PrismaClientKnownRequestError: class extends Error { code: string; constructor(message: string, code: string) { super(message); this.code = code; } } } };
});

const prisma = new PrismaClient();

describe('UserService.deleteUser', () => {
  const userId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar true quando a exclusão for bem-sucedida', async () => {
    (prisma.user.delete as jest.Mock).mockResolvedValueOnce({});

    const result = await UserService.deleteUser(userId);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toBe(true);
  });

it('deve retornar false quando o usuário não for encontrado (Prisma P2025)', async () => {
  const prismaError = new Error('User not found') as any;
  prismaError.code = 'P2025';

  (prisma.user.delete as jest.Mock).mockRejectedValueOnce(prismaError);

  const result = await UserService.deleteUser(userId);

  expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
  expect(result).toBe(false);
});


  it('deve retornar false e logar o erro para um erro inesperado', async () => {
    const unexpectedError = new Error('Unexpected Error');
    console.error = jest.fn(); 
    (prisma.user.delete as jest.Mock).mockRejectedValueOnce(unexpectedError);

    const result = await UserService.deleteUser(userId);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    expect(console.error).toHaveBeenCalledWith('Erro ao deletar usuário:', unexpectedError);
    expect(result).toBe(false);
  });
});