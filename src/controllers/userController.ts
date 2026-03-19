import { Request, Response } from "express";

export async function getUsers(req: Request, res: Response) {
  res.json({
    message: "Route protégée OK",
    authenticatedUser: (req as any).user,
    users: [
      { id: 1, name: "remy" },
      { id: 2, name: "bob" },
    ],
  });
}