import { Request, Response } from "express";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken
} from "../services/tokenService";

// Faux stockage en mémoire (remplace la BDD pour l'exo)
let users: any[] = [];

export async function register(req: Request, res: Response) {
  const { name, password, confirmPassword } = req.body;
  const file = req.file;

  if (!name || !password || !confirmPassword) {
    res.status(400).json({ message: "Tous les champs sont requis" });
    return;
  }

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Les mots de passe ne correspondent pas" });
    return;
  }

  const existingUser = users.find((u) => u.name === name);

  if (existingUser) {
    res.status(409).json({ message: "Utilisateur déjà existant" });
    return;
  }

  let avatarUrl: string | null = null;

  if (file) {
    avatarUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  }

  const newUser = {
    id: users.length + 1,
    name,
    password,
    avatar: avatarUrl
  };

  users.push(newUser);

  res.status(201).json({
    message: "Compte créé",
    user: {
      id: newUser.id,
      name: newUser.name,
      avatar: newUser.avatar
    }
  });
}

// Faux utilisateur fallback (si tu veux tester vite)
const fakeUser = {
  id: 999,
  name: "remy",
  password: "ioupi",
  avatar: null
};

export async function login(req: Request, res: Response) {
  const { name, password } = req.body;

  const user =
    users.find((u) => u.name === name) ||
    (name === fakeUser.name && password === fakeUser.password
      ? fakeUser
      : null);

  if (!user || user.password !== password) {
    res.status(401).json({ message: "Identifiants invalides" });
    return;
  }

  const payload = {
    userId: user.id,
    name: user.name
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: "lax"
  });

  res.json({
    message: "Connexion réussie",
    user: {
      id: user.id,
      name: user.name,
      avatar: user.avatar || null
    }
  });
}

export async function refresh(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      res.status(401).json({ message: "Refresh token manquant" });
      return;
    }

    const payload = verifyRefreshToken(refreshToken);

    const newAccessToken = generateAccessToken({
      userId: payload.userId,
      name: payload.name
    });

    res.cookie("access_token", newAccessToken, {
      httpOnly: true,
      sameSite: "lax"
    });

    res.json({
      message: "Access token renouvelé"
    });
  } catch {
    res.status(401).json({ message: "Refresh token invalide ou expiré" });
  }
}

export async function logout(req: Request, res: Response) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");

  res.json({
    message: "Déconnexion réussie"
  });
}

export async function checkAuthStatus(req: Request, res: Response) {
  const token = req.cookies.access_token;

  if (!token) {
    res.json({ authenticated: false });
    return;
  }

  res.json({ authenticated: true });
}