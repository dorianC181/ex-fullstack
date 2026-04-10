import { Request, Response } from "express";
import { hash, compare } from "bcrypt";
import { pool } from "../db";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../services/tokenService";

export async function register(req: Request, res: Response) {
  const { name, password, confirmPassword } = req.body;

  if (!name || !password || !confirmPassword) {
    res.status(400).json({ message: "Champs requis" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Passwords différents" });
    return;
  }

  const conn = await pool.getConnection();

  try {
    const users: any[] = await conn.query(
      "SELECT * FROM users WHERE name = ?",
      [name]
    );

    if (users.length > 0) {
      res.status(409).json({ message: "Utilisateur existe déjà" });
      return;
    }

    const passwordHash = await hash(password, 10);

    const result: any = await conn.query(
      "INSERT INTO users(name, passwordHash) VALUES (?, ?)",
      [name, passwordHash]
    );

    res.status(201).json({
      message: "Compte créé",
      user: {
        id: result.insertId,
        name
      }
    });
  } finally {
    conn.end();
  }
}

export async function login(req: Request, res: Response) {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400).json({ message: "Champs requis" });
    return;
  }

  const conn = await pool.getConnection();

  try {
    const users: any[] = await conn.query(
      "SELECT * FROM users WHERE name = ?",
      [name]
    );

    if (users.length === 0) {
      res.status(401).json({ message: "Identifiants invalides" });
      return;
    }

    const user = users[0];
    const ok = await compare(password, user.passwordHash);

    if (!ok) {
      res.status(401).json({ message: "Identifiants invalides" });
      return;
    }

    const payload = { userId: user.id, name: user.name };

    res.cookie("access_token", generateAccessToken(payload), {
      httpOnly: true,
      sameSite: "lax"
    });

    res.cookie("refresh_token", generateRefreshToken(payload), {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({ message: "Connexion réussie" });
  } finally {
    conn.end();
  }
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.json({ message: "Déconnexion réussie" });
}

export async function refresh(req: Request, res: Response) {
  try {
    const token = req.cookies.refresh_token;

    if (!token) {
      res.status(401).json({ message: "Refresh token manquant" });
      return;
    }

    const payload: any = verifyRefreshToken(token);

    res.cookie(
      "access_token",
      generateAccessToken({
        userId: payload.userId,
        name: payload.name
      }),
      {
        httpOnly: true,
        sameSite: "lax"
      }
    );

    res.json({ message: "Refreshed" });
  } catch {
    res.status(401).json({ message: "Invalid refresh" });
  }
}