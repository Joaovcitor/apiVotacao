import { PollType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// --- CRIAÇÃO DE ENQUETES ---

// Agora a função precisa do tipo e as opções são opcionais
export async function createPoll(
  pollData: { title: string; type: PollType },
  optionsTitles?: string[] // O '?' torna o parâmetro opcional
) {
  // Validação: Enquetes CHECKBOX DEVEM ter opções
  if (
    pollData.type === "CHECKBOX" &&
    (!optionsTitles || optionsTitles.length === 0)
  ) {
    throw new Error("Enquetes do tipo CHECKBOX precisam de opções.");
  }

  return prisma.poll.create({
    data: {
      title: pollData.title,
      type: pollData.type,
      // Cria as opções apenas se elas foram fornecidas
      options:
        pollData.type === "CHECKBOX"
          ? { createMany: { data: optionsTitles!.map((title) => ({ title })) } }
          : undefined,
    },
  });
}

async function addOptionInPoll(pollId: number, optionTitle: string) {
  return prisma.pollOption.create({
    data: {
      pollId: pollId,
      title: optionTitle,
    },
  });
}

// --- VOTAÇÃO ---

// Tipagem para os dados do voto, que podem variar
type VotePayload = {
  userId: number;
  // Ou um array de números para checkbox, ou uma string para texto
  data: number[] | string;
};

// Uma única função inteligente para lidar com ambos os tipos de voto
export async function voteOnPoll(pollId: number, payload: VotePayload) {
  // 1. Primeiro, buscamos a enquete para saber seu tipo
  const poll = await prisma.poll.findUnique({
    where: { id: pollId },
    include: {
      checkboxVotes: {
        include: {
          user: true,
        },
      },
    },
  });

  if (poll?.checkboxVotes.find((vote) => vote.userId === payload.userId)) {
    throw new Error(
      `Usuário já votou na enquete. Nome do usuário: ${
        poll.checkboxVotes.find((vote) => vote.userId === payload.userId)?.user
          .name
      }, enquete que ele votou: ${poll.title}`
    );
  }

  if (!poll) {
    throw new Error("Enquete não encontrada.");
  }

  // 2. Agimos de acordo com o tipo da enquete
  if (poll.type === "CHECKBOX") {
    if (typeof payload.data !== "object") {
      throw new Error(
        "Dados inválidos para uma enquete de CHECKBOX. Esperava um array de números."
      );
    }

    const votesData = payload.data.map((optionId) => ({
      userId: payload.userId,
      pollId: pollId,
      pollOptionId: optionId,
    }));

    // Usa a tabela CheckboxVote
    return prisma.checkboxVote.createMany({
      data: votesData,
      skipDuplicates: true,
    });
  }

  if (poll.type === "TEXT") {
    if (typeof payload.data !== "string") {
      throw new Error(
        "Dados inválidos para uma enquete de TEXTO. Esperava uma string."
      );
    }

    // Usa a tabela TextVote
    return prisma.textVote.create({
      data: {
        userId: payload.userId,
        pollId: pollId,
        text: payload.data,
      },
    });
  }
}

async function GetAllPoll() {
  return prisma.poll.findMany({
    include: {
      // Inclui as opções de resposta para enquetes do tipo CHECKBOX
      options: true,
      // Usa o _count para obter um resumo eficiente do número de votos
      _count: {
        select: {
          checkboxVotes: true, // Conta quantos votos de múltipla escolha a enquete recebeu
          textVotes: true, // Conta quantas respostas de texto a enquete recebeu
        },
      },
    },
  });
}

async function GetPollById(pollId: number) {
  return prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      // Para enquetes CHECKBOX: inclui as opções e a contagem de votos de CADA opção
      options: {
        include: {
          _count: {
            select: {
              votes: true, // 'votes' é o nome da relação em PollOption para CheckboxVote
            },
          },
        },
      },
    },
  });
}

async function GetUsersVoteInPoll(pollId: number) {
  return prisma.poll.findUnique({
    where: {
      id: pollId,
    },
    include: {
      options: {
        include: {
          votes: {
            include: {
              user: {
                select: {
                  name: true,
                  cpf: true,
                },
              },
            },
          },
        },
      },
    },
  });
}

async function RemoveOptionPoll(pollId: number, optionId: number) {
  const result = await prisma.$transaction(async (tsx) => {
    await tsx.checkboxVote.deleteMany({
      where: {
        pollOptionId: optionId,
      },
    });

    return tsx.pollOption.delete({
      where: {
        id: optionId,
        pollId: pollId,
      },
    });
  });
  return result;
}
async function removeVotes(checkBoxId: number) {
  return await prisma.checkboxVote.delete({ where: { id: checkBoxId } });
}
async function removeVotesUser(userId: number) {
  return await prisma.checkboxVote.deleteMany({
    where: {
      userId: userId,
    },
  });
}

export const pollService = {
  createPoll,
  GetAllPoll,
  GetPollById,
  voteOnPoll,
  RemoveOptionPoll,
  removeVotes,
  addOptionInPoll,
  GetUsersVoteInPoll,
  removeVotesUser,
};
