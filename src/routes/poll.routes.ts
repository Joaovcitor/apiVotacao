import { Router } from "express";
import { pollController } from "../controllers/poll.controller";
import { authMiddleware } from "../middlewares/auth.middleware"; // <-- 1. IMPORTE O MIDDLEWARE
import { blockVoteMiddleware } from "../middlewares/blockVote.middleware";

const pollRouter = Router();

// Rota para criar (agora protegida) e listar enquetes (pode ser pública)
pollRouter.post("/polls", authMiddleware, pollController.createPoll); // <-- 2. APLIQUE ANTES DO CONTROLLER
pollRouter.get("/polls", pollController.getAllPolls);

// Rota para buscar uma enquete específica (pública)
pollRouter.get("/polls/:id", pollController.getPollById);

// Rota para votar em uma enquete (agora protegida)
pollRouter.post(
  "/polls/:id/vote",
  authMiddleware,
  blockVoteMiddleware,
  pollController.voteOnPoll
); // <-- 3. APLIQUE AQUI TAMBÉM

// Rota para remover uma opção de uma enquete (agora protegida)
pollRouter.delete(
  "/polls/:id/option",
  authMiddleware,
  pollController.RemoveOptionPoll
); // <-- 4. APLIQUE AQUI TAMBÉM

pollRouter.delete(
  "/polls/delete/vote",
  authMiddleware,
  pollController.deleteVote
);

pollRouter.post(
  "/polls/:id/option",
  authMiddleware,
  pollController.addOptionInPoll
);

pollRouter.get(
  "/polls/:id/users-vote",
  authMiddleware,
  pollController.GetUsersVoteInPoll
);
pollRouter.delete(
  "/polls/remove-votes-user",
  authMiddleware,
  pollController.removeVotesUser
);

export { pollRouter };
