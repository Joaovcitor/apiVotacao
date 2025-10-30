import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware"; // <-- 1. IMPORTE O MIDDLEWARE

const userRouter = Router();

// Rota para criar um usuário (pública)
userRouter.post("/users", userController.createUser);

// Rotas para listar todos e buscar por ID (protegidas)
userRouter.get("/users", authMiddleware, userController.getAllUsers); // <-- 2. PROTEGIDA
userRouter.get("/users/:id", authMiddleware, userController.getUserById); // <-- 3. PROTEGIDA

export { userRouter };
