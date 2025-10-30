import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Reutilizamos a interface do passo anterior
interface JwtPayload {
  userId: number;
  name: string;
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Pega o token do cookie da requisição
  const { token } = req.cookies;

  // 2. Se não houver token, retorna um erro de "Não Autorizado"
  if (!token) {
    return res
      .status(401)
      .json({ error: "Acesso negado. Nenhum token fornecido." });
  }

  // 3. Verifica se o token é válido
  try {
    // Tenta verificar o token usando o segredo
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

    // 4. Se for válido, anexa o payload decodificado ao objeto 'req'
    req.user = decoded;

    // 5. Chama o próximo middleware ou a função do controller
    return next();
  } catch (error) {
    // Se a verificação falhar (token expirado, inválido, etc.), retorna um erro
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }
}
