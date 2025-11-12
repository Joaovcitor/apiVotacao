import { Request, Response, NextFunction } from "express";

export function blockVoteMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.VOTE_BLOCKED === "true") {
    return res.status(400).json({ message: "Votação encerrada!" });
  }

  next();
}
