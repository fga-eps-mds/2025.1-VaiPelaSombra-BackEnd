
import { prisma } from "../data/prismaClient";
import bcrypt from "bcrypt";
import { gerarToken } from "../utils/jwt.util";

export async function autenticarUsuario(email: string, senha: string) {
  const usuario = await prisma.user.findUnique({ where: { email } });

  if (!usuario) {
    throw new Error("Usuário não encontrado.");
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);

  if (!senhaValida) {
    throw new Error("Senha incorreta.");
  }

  const token = gerarToken({ id: usuario.id, email: usuario.email });

  return {
    usuario: {
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
    },
    token,
  };
}
