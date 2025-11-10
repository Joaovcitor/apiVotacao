import { Prisma, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Cria um novo usuário no banco de dados.
 * @param userData - Dados do usuário (nome e CPF).
 * @returns O usuário recém-criado.
 */
async function createUser(userData: Prisma.UserCreateInput) {
  // O Prisma vai gerar um erro automaticamente se o CPF for duplicado (P2002)
  return prisma.user.create({
    data: userData,
  });
}

/**
 * Retorna uma lista de todos os usuários.
 * @returns Um array com todos os usuários.
 */
async function getAllUsers() {
  return prisma.user.findMany({
    include: {
      // Inclui todos os votos de checkbox que o usuário fez
      checkboxVotes: {
        include: {
          poll: { select: { title: true } }, // Em qual enquete votou
          pollOption: { select: { title: true } }, // Em qual opção votou
        },
      },
      // Inclui todos os votos de texto que o usuário fez
      textVotes: {
        include: {
          poll: { select: { title: true } }, // Em qual enquete votou
        },
      },
    },
  });
}

/**
 * Busca um usuário pelo seu ID, incluindo seus votos.
 * @param userId - O ID do usuário.
 * @returns O objeto do usuário com seus votos, ou null se não for encontrado.
 */
async function getUserById(userId: number) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      // Inclui todos os votos de checkbox que o usuário fez
      checkboxVotes: {
        include: {
          poll: { select: { title: true } }, // Em qual enquete votou
          pollOption: { select: { title: true } }, // Em qual opção votou
        },
      },
      // Inclui todos os votos de texto que o usuário fez
      textVotes: {
        include: {
          poll: { select: { title: true } }, // Em qual enquete votou
        },
      },
    },
  });
}

/**
 * Atualiza os dados de um usuário (ex: nome).
 * @param userId - O ID do usuário a ser atualizado.
 * @param userData - Os novos dados para o usuário.
 * @returns O usuário com os dados atualizados.
 */
async function updateUser(userId: number, userData: Prisma.UserUpdateInput) {
  return prisma.user.update({
    where: { id: userId },
    data: userData,
  });
}

/**
 * Deleta um usuário do banco de dados.
 * @param userId - O ID do usuário a ser deletado.
 */
async function deleteUser(userId: number) {
  return prisma.user.delete({
    where: { id: userId },
  });
}

export const userService = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};
