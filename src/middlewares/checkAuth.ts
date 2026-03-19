import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/tokenService";

export function checkAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      res.status(401).json({ message: "Non authentifié" });
      return;
    }

    const payload = verifyAccessToken(token);
    (req as any).user = payload;

    next();
  } catch {
    res.status(401).json({ message: "Token invalide" });
  }
}