// Define o payload que armazenamos no JWT
interface JwtPayload {
  userId: number;
  name: string;
}

// Estende a interface Request do Express
declare namespace Express {
  export interface Request {
    user: JwtPayload; // Adiciona a propriedade 'user' ao Request
  }
}
