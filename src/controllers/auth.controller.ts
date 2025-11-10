import { Request, Response } from "express";
import { authService } from "../services/auth.service";

/**
 * Lida com a requisição de login do usuário.
 */
async function login(req: Request, res: Response): Promise<Response> {
  try {
    const { cpf } = req.body;

    if (!cpf) {
      return res.status(400).json({ error: "CPF é obrigatório." });
    }

    const { user, token } = await authService.loginWithCpf(cpf);

    // Configura o cookie na resposta HTTP
    res.cookie("token", token, {
      httpOnly: true, // Impede que o cookie seja acessado via JavaScript no cliente (essencial para segurança)
      secure: true, // Em produção, enviar apenas sobre HTTPS
      sameSite: "none", // Ajuda a mitigar ataques CSRF
      maxAge: 24 * 60 * 60 * 1000, // Tempo de vida do cookie: 1 dia (em milissegundos)
    });
    console.log(user);

    return res.status(200).json({ message: "Login bem-sucedido!", user });
  } catch (error: any) {
    if (error.message.includes("Usuário não encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    console.error(error);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

/**
 * Lida com a requisição de logout.
 */
async function logout(req: Request, res: Response): Promise<Response> {
  // Limpa o cookie que contém o token
  res.clearCookie("token");
  return res.status(200).json({ message: "Logout bem-sucedido." });
}

export const authController = {
  login,
  logout,
};
