import { Request, Response } from "express";
import { pool } from "../db.js";
import type { DbRecipe } from "../types/db.js";
import type { CreateRecipeData, UpdateRecipeData } from "../types/dto.js";

function computeDifficulty(recipe: {
  oven_required: number;
  special_equipment_required: number;
  exotic_ingredients: number;
}) {
  const oven = recipe.oven_required === 1;
  const equipment = recipe.special_equipment_required === 1;
  const exotic = recipe.exotic_ingredients === 1;

  if (oven && equipment && exotic) return "Difficile";
  if (oven || equipment || exotic) return "Difficulté moyenne";
  return "Facile";
}

function mapRecipe(recipe: DbRecipe) {
  return {
    id: Number(recipe.id),
    name: recipe.name,
    ingredients: JSON.parse(recipe.ingredients),
    servings: Number(recipe.servings),
    ovenRequired: !!recipe.oven_required,
    specialEquipmentRequired: !!recipe.special_equipment_required,
    exoticIngredients: !!recipe.exotic_ingredients,
    countryOfOrigin: recipe.country_of_origin,
    priceLevel: Number(recipe.price_level),
    createdAt: recipe.created_at,
    updatedAt: recipe.updated_at,
    authorId: Number(recipe.author_id),
    viewsCount: Number(recipe.views_count),
    lastViewedAt: recipe.last_viewed_at,
    difficulty: computeDifficulty(recipe)
  };
}

export async function getHomeRecipes(_req: Request, res: Response) {
  const conn = await pool.getConnection();

  try {
    const recipes = await conn.query(
      `SELECT * FROM recipes
       WHERE country_of_origin = 'France'
          OR last_viewed_at >= NOW() - INTERVAL 10 DAY
       ORDER BY views_count DESC
       LIMIT 10`
    ) as DbRecipe[];

    res.json(recipes.map(mapRecipe));
  } finally {
    conn.end();
  }
}

export async function getAllRecipes(_req: Request, res: Response) {
  const conn = await pool.getConnection();

  try {
    const recipes = await conn.query(
      "SELECT * FROM recipes ORDER BY created_at DESC"
    ) as DbRecipe[];

    res.json(recipes.map(mapRecipe));
  } finally {
    conn.end();
  }
}

export async function searchRecipes(req: Request, res: Response) {
  let conn;

  try {
    const q = String(req.query.q || "").trim();

    conn = await pool.getConnection();

    const recipes = await conn.query(
      "SELECT * FROM recipes WHERE name LIKE ? ORDER BY created_at DESC",
      [`%${q}%`]
    ) as DbRecipe[];

    res.json(recipes.map(mapRecipe));
  } catch (error) {
    console.error("SEARCH ERROR:", error);
    res.status(500).json({ message: "Erreur serveur recherche" });
  } finally {
    if (conn) conn.end();
  }
}

export async function getRecipeById(req: Request, res: Response) {
  const id = Number(req.params.id);
  const conn = await pool.getConnection();

  try {
    await conn.query(
      "UPDATE recipes SET views_count = views_count + 1, last_viewed_at = NOW() WHERE id = ?",
      [id]
    );

    const recipes = await conn.query(
      "SELECT * FROM recipes WHERE id = ?",
      [id]
    ) as DbRecipe[];

    if (recipes.length === 0) {
      res.status(404).json({ message: "Recette introuvable" });
      return;
    }

    res.json(mapRecipe(recipes[0]));
  } finally {
    conn.end();
  }
}

export async function createRecipe(req: Request, res: Response) {
  const conn = await pool.getConnection();

  try {
    const data = req.body as CreateRecipeData;
    const user = (req as any).user;

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

export async function duplicateRecipe(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = (req as any).user;
  const conn = await pool.getConnection();

  try {
    const recipes = await conn.query(
      "SELECT * FROM recipes WHERE id = ?",
      [id]
    ) as DbRecipe[];

    if (recipes.length === 0) {
      res.status(404).json({ message: "Recette introuvable" });
      return;
    }

    const recipe = recipes[0];

    const result: any = await conn.query(
      `INSERT INTO recipes
      (name, ingredients, servings, oven_required, special_equipment_required, exotic_ingredients, country_of_origin, price_level, author_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `${recipe.name} (copie)`,
        recipe.ingredients,
        recipe.servings,
        recipe.oven_required,
        recipe.special_equipment_required,
        recipe.exotic_ingredients,
        recipe.country_of_origin,
        recipe.price_level,
        user.userId
      ]
    );

    res.status(201).json({
      message: "Recette dupliquée",
      id: Number(result.insertId)
    });
  } finally {
    conn.end();
  }
}

export async function updateRecipe(req: Request, res: Response) {
  const id = Number(req.params.id);
  const data = req.body as UpdateRecipeData;
  const user = (req as any).user;
  const conn = await pool.getConnection();

  try {
    const recipes = await conn.query(
      "SELECT * FROM recipes WHERE id = ?",
      [id]
    ) as DbRecipe[];

    if (recipes.length === 0) {
      res.status(404).json({ message: "Recette introuvable" });
      return;
    }

    if (Number(recipes[0].author_id) !== Number(user.userId)) {
      res.status(403).json({ message: "Interdit" });
      return;
    }

    await conn.query(
      `UPDATE recipes
       SET name = ?, ingredients = ?, servings = ?, oven_required = ?, special_equipment_required = ?, exotic_ingredients = ?, country_of_origin = ?, price_level = ?
       WHERE id = ?`,
      [
        data.name,
        JSON.stringify(data.ingredients),
        data.servings,
        data.ovenRequired ? 1 : 0,
        data.specialEquipmentRequired ? 1 : 0,
        data.exoticIngredients ? 1 : 0,
        data.countryOfOrigin,
        data.priceLevel,
        id
      ]
    );

    res.json({ message: "Recette modifiée" });
  } finally {
    conn.end();
  }
}

export async function deleteRecipe(req: Request, res: Response) {
  const id = Number(req.params.id);
  const user = (req as any).user;
  const conn = await pool.getConnection();

  try {
    const recipes = await conn.query(
      "SELECT * FROM recipes WHERE id = ?",
      [id]
    ) as DbRecipe[];

    if (recipes.length === 0) {
      res.status(404).json({ message: "Recette introuvable" });
      return;
    }

    if (Number(recipes[0].author_id) !== Number(user.userId)) {
      res.status(403).json({ message: "Interdit" });
      return;
    }

    await conn.query("DELETE FROM recipes WHERE id = ?", [id]);

    res.json({ message: "Recette supprimée" });
  } finally {
    conn.end();
  }
}