import { prisma } from '../data/prismaClient';
import bcrypt from 'bcrypt';
import { generateToken } from '../utils/jwt.util';

export const loginService = {
  async authenticateUser(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new Error('Invalid email or password');
    }

    const token = generateToken({ id: user.id, email: user.email });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
      },
    };
  },
};
