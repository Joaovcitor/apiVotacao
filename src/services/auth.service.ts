import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

/**
 * Autentica um usuário pelo CPF.
 * @param cpf O CPF do usuário.
 * @returns Um objeto contendo o usuário e o token JWT.
 * @throws Lança um erro se o usuário não for encontrado.
 */
async function loginWithCpf(cpf: string) {
  // 1. Encontra o usuário pelo CPF
  const user = await prisma.user.findUnique({
    where: { cpf },
  });

  if (!user) {
    throw new Error("Usuário não encontrado com o CPF fornecido.");
  }

  // 2. Define o que será armazenado no token (o payload)
  const payload = {
    userId: user.id,
    name: user.name,
  };

  // 3. Gera o token JWT, assinado com o segredo do .env
  const token = jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: "1d", // O token expira em 1 dia
  });

  // Retorna o token e os dados do usuário (sem dados sensíveis)
  return {
    user: {
      id: user.id,
      name: user.name,
      cpf: user.cpf,
    },
    token,
  };
}

export const authService = {
  loginWithCpf,
};
