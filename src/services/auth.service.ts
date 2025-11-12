import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
async function loginWithCpf(cpf: string) {
  // 1. Encontra o usuário pelo CPF
  const user = await prisma.user.findUnique({
    where: { cpf },
  });

  if (user?.role !== "ADMIN") {
    throw new Error("Acesso negado. Usuário não é administrador.");
  }

  if (!user) {
    throw new Error("Usuário não encontrado com o CPF fornecido.");
  }

  // 2. Define o que será armazenado no token (o payload)
  const payload = {
    userId: user.id,
    name: user.name,
    role: user.role,
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
      role: user.role,
    },
    token,
  };
}

export const authService = {
  loginWithCpf,
};
