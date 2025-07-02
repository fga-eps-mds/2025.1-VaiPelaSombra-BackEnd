import { UserService } from '../services/user.service';
import { PrismaClient, Prisma } from '../generated/prisma';

jest.mock('../generated/prisma', () => {
  const mPrismaClient = {
    user: {
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
    Prisma: {
      PrismaClientKnownRequestError: class extends Error {
        code: string;
        constructor(message: string, code: string) {
          super(message);
          this.code = code;
        }
      },
    },
  };
});

const prisma = new PrismaClient();
const userService = new UserService();

describe('UserService.delete', () => {
  const userId = 1;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve retornar o usuário deletado quando a exclusão for bem-sucedida', async () => {
    const deletedUser = { id: userId, name: 'Usuário Excluído' };
    (prisma.user.delete as jest.Mock).mockResolvedValueOnce(deletedUser);

    const result = await userService.delete(userId);

    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
    expect(result).toEqual(deletedUser);
  });

  it('deve lançar erro quando o usuário não for encontrado (Prisma P2025)', async () => {
    const prismaError = new Error('User not found') as any;
    prismaError.code = 'P2025';

    (prisma.user.delete as jest.Mock).mockRejectedValueOnce(prismaError);

    await expect(userService.delete(userId)).rejects.toThrow('User not found');
    expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: userId } });
  });

  it('deve lançar erro inesperado e logar no console', async () => {
    const unexpectedError = new Error('Unexpected Error');
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    (prisma.user.delete as jest.Mock).mockRejectedValueOnce(unexpectedError);

    await expect(userService.delete(userId)).rejects.toThrow('Unexpected Error');
    expect(console.error).toHaveBeenCalledWith('Erro ao deletar usuário:', unexpectedError);

    consoleSpy.mockRestore();
  });
});
