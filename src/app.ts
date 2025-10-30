import express, { Application, Request, Response } from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import { pollRouter } from "./routes/poll.routes";
import { userRouter } from "./routes/user.routes";
import { authRouter } from "./routes/auth.routes";
class App {
  // A instância do Express será armazenada aqui
  public app: Application;

  // O construtor é executado quando criamos uma nova instância da classe
  constructor() {
    // Inicializamos a aplicação Express
    this.app = express();

    // Chamamos os métodos para configurar o servidor
    this.initializeMiddlewares();
    this.initializeRoutes();
  }

  /**
   * Configura os middlewares essenciais da aplicação.
   * Middlewares são funções executadas a cada requisição.
   */
  private initializeMiddlewares(): void {
    // --- 2. Definição da configuração do CORS ---
    const corsOptions: CorsOptions = {
      // Permite que apenas a origem do seu front-end acesse a API.
      // É CRUCIAL definir a URL correta do seu front-end aqui.
      origin: process.env.FRONTEND_URL || "http://localhost:5173",

      // Essencial para que o front-end possa enviar e receber os cookies de autenticação.
      credentials: true,

      // Métodos HTTP permitidos
      methods: "GET,POST,PUT,DELETE,PATCH,OPTIONS",

      // Headers permitidos na requisição
      allowedHeaders: "Content-Type,Authorization",
    };

    // --- 3. Aplicação do middleware de CORS com as opções definidas ---
    this.app.use(cors(corsOptions));

    this.app.use(express.json());
    this.app.use(cookieParser());
  }

  /**
   * Registra todas as rotas da aplicação.
   */
  private initializeRoutes(): void {
    // Adiciona as rotas de enquete, prefixadas com /api
    this.app.use("/api", pollRouter);
    this.app.use("/api", userRouter);
    this.app.use("/api", authRouter);
    // (Opcional) Uma rota "health check" para verificar se a API está no ar
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ status: "API is running successfully!" });
    });
  }

  public listen(port: number): void {
    this.app.listen(port, () => {
      console.log(`🚀 Servidor inicializado e rodando na porta ${port}`);
    });
  }
}

// Exportamos a classe para que possa ser usada em outros arquivos
export { App };
