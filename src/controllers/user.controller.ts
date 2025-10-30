import { Request, Response } from "express";
import { userService } from "../services/user.service";

/**
 * Lida com a criação de um novo usuário.
 */
async function createUser(req: Request, res: Response): Promise<Response> {
  try {
    const { name, cpf } = req.body;

    if (!name || !cpf) {
      return res.status(400).json({ error: "Nome e CPF são obrigatórios." });
    }

    const newUser = await userService.createUser({ name, cpf });
    return res.status(201).json(newUser);
  } catch (error: any) {
    // Código de erro do Prisma para violação de constraint única (CPF duplicado)
    if (error.code === "P2002") {
      return res.status(409).json({ error: "Este CPF já está cadastrado." });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao criar usuário." });
  }
}

/**
 * Lida com a busca de todos os usuários.
 */
async function getAllUsers(req: Request, res: Response): Promise<Response> {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar usuários." });
  }
}

/**
 * Lida com a busca de um usuário por ID.
 */
async function getUserById(req: Request, res: Response): Promise<Response> {
  try {
    const userId = parseInt(req.params.id, 10);
    if (isNaN(userId)) {
      return res.status(400).json({ error: "ID de usuário inválido." });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    return res.status(200).json(user);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar usuário." });
  }
}

// ... (Outros controllers como updateUser e deleteUser podem ser adicionados aqui seguindo o mesmo padrão)

export const userController = {
  createUser,
  getAllUsers,
  getUserById,
};
