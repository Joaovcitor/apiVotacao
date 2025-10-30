import "dotenv/config"; // Garante que as variáveis de ambiente (.env) sejam carregadas
import { App } from "./app";

// Define a porta do servidor, buscando do .env ou usando 3333 como padrão
const PORT = parseInt(process.env.PORT || "3333", 10);

// Cria uma nova instância da nossa aplicação
const server = new App();

// Inicia o servidor na porta definida
server.listen(PORT);
