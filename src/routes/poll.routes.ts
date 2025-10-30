import { Router } from "express";
import { pollController } from "../controllers/poll.controller";
import { authMiddleware } from "../middlewares/auth.middleware"; // <-- 1. IMPORTE O MIDDLEWARE

const pollRouter = Router();

// Rota para criar (agora protegida) e listar enquetes (pode ser pública)
pollRouter.post("/polls", authMiddleware, pollController.createPoll); // <-- 2. APLIQUE ANTES DO CONTROLLER
pollRouter.get("/polls", pollController.getAllPolls);

// Rota para buscar uma enquete específica (pública)
pollRouter.get("/polls/:id", pollController.getPollById);

// Rota para votar em uma enquete (agora protegida)
pollRouter.post("/polls/:id/vote", authMiddleware, pollController.voteOnPoll); // <-- 3. APLIQUE AQUI TAMBÉM

export { pollRouter };
