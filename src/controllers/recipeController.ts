import { Request, Response } from "express";
import { pool } from "../db.js";

export async function getAllRecipes(_req: Request, res: Response) {
  const conn = await pool.getConnection();

  try {
    const recipes = await conn.query("SELECT * FROM recipes");
    res.json(recipes);
  } finally {
    conn.end();
  }
}

export async function createRecipe(req: Request, res: Response) {
  const data = req.body;
  const user = (req as any).user;

  const conn = await pool.getConnection();

  try {
    const result: any = await conn.query(
      `INSERT INTO recipes
      (name, ingredients, servings, oven_required, special_equipment_required, exotic_ingredients, country_of_origin, price_level, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        JSON.stringify(data.ingredients),
        data.servings,
        data.ovenRequired ? 1 : 0,
        data.specialEquipmentRequired ? 1 : 0,
        data.exoticIngredients ? 1 : 0,
        data.countryOfOrigin,
        data.priceLevel,
        user.userId
      ]
    );

    res.status(201).json({
      message: "Recette créée",
      id: Number(result.insertId)
    });
  } finally {
    conn.end();
  }
}