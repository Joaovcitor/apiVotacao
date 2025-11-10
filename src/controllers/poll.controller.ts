import { Request, Response } from "express";
import { pollService } from "../services/poll.service";
import { PollType, RolesUser } from "@prisma/client";

// Controller para criar uma nova enquete
async function createPoll(req: Request, res: Response): Promise<Response> {
  try {
    const { title, type, options } = req.body as {
      title: string;
      type: PollType;
      options?: string[];
    };

    // Validação básica de entrada
    if (!title || !type) {
      return res.status(400).json({ error: "Título e tipo são obrigatórios." });
    }

    const newPoll = await pollService.createPoll({ title, type }, options);
    return res.status(201).json(newPoll);
  } catch (error: any) {
    // Erro específico do serviço (ex: CHECKBOX sem opções)
    if (error.message.includes("precisam de opções")) {
      return res.status(400).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao criar enquete." });
  }
}

// Controller para listar todas as enquetes
async function getAllPolls(req: Request, res: Response): Promise<Response> {
  try {
    const polls = await pollService.GetAllPoll();
    return res.status(200).json(polls);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar enquetes." });
  }
}

// Controller para buscar uma enquete pelo ID
async function getPollById(req: Request, res: Response): Promise<Response> {
  try {
    const pollId = parseInt(req.params.id, 10);

    // Valida se o ID é um número válido
    if (isNaN(pollId)) {
      return res.status(400).json({ error: "ID da enquete inválido." });
    }

    const poll = await pollService.GetPollById(pollId);

    if (!poll) {
      return res.status(404).json({ error: "Enquete não encontrada." });
    }

    return res.status(200).json(poll);
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao buscar enquete." });
  }
}

// Controller para registrar um voto em uma enquete
async function voteOnPoll(req: Request, res: Response): Promise<Response> {
  try {
    const pollId = parseInt(req.params.id, 10);
    const userId = req.user.userId;
    const { data } = req.body as {
      data: number[] | string;
    };

    // Validações de entrada
    if (isNaN(pollId)) {
      return res.status(400).json({ error: "ID da enquete inválido." });
    }
    if (!userId || data === undefined) {
      return res.status(400).json({ error: "userId e data são obrigatórios." });
    }

    const result = await pollService.voteOnPoll(pollId, { userId, data });
    return res
      .status(201)
      .json({ message: "Voto registrado com sucesso!", details: result });
  } catch (error: any) {
    // Erros específicos lançados pelo serviço
    if (error.message.includes("não encontrada")) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes("inválidos")) {
      return res.status(400).json({ error: error.message });
    }
    // Erros de constraint do Prisma (ex: voto duplicado)
    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ error: "Este usuário já registrou este voto." }); // 409 Conflict
    }

    console.error(error);
    return res.status(500).json({ error: "Erro interno ao registrar voto." });
  }
}

async function RemoveOptionPoll(
  req: Request,
  res: Response
): Promise<Response> {
  try {
    const pollId = parseInt(req.params.id, 10);
    const optionId = parseInt(req.body.id, 10);
    const user = req.user.role;

    if (user !== RolesUser.ADMIN) {
      return res
        .status(403)
        .json({ error: "Acesso negado. Permissão insuficiente." });
    }
    // Valida se o ID é um número válido
    if (isNaN(pollId)) {
      return res.status(400).json({ error: "ID da enquete inválido." });
    }
    // Valida se o ID é um número válido
    if (isNaN(optionId)) {
      return res.status(400).json({ error: "ID da opção inválido." });
    }

    const poll = await pollService.RemoveOptionPoll(pollId, optionId);

    if (!poll) {
      return res.status(404).json({ error: "Enquete não encontrada." });
    }

    return res.status(200).json({ message: "Enquete excluída com sucesso!" });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno ao excluir enquete." });
  }
}

async function deleteVote(req: Request, res: Response) {
  const id = req.body.id;

  try {
    const vote = await pollService.removeVotes(id);
    res.status(200).json(vote);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

async function addOptionInPoll(req: Request, res: Response) {
  const pollId = parseInt(req.params.id, 10);
  const optionTitle = req.body.title;

  try {
    const option = await pollService.addOptionInPoll(pollId, optionTitle);
    res.status(200).json(option);
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
}

export const pollController = {
  createPoll,
  getAllPolls,
  getPollById,
  voteOnPoll,
  RemoveOptionPoll,
  deleteVote,
  addOptionInPoll,
};
