import { Router } from "express";
import {
  getHomeRecipes,
  getAllRecipes,
  searchRecipes,
  getRecipeById,
  createRecipe,
  duplicateRecipe,
  updateRecipe,
  deleteRecipe
} from "../controllers/recipeController.js";
import { checkAuth } from "../middlewares/checkAuth.js";

const router = Router();

router.get("/home", getHomeRecipes);
router.get("/search", searchRecipes);
router.get("/", getAllRecipes);
router.get("/:id", getRecipeById);

router.post("/", checkAuth, createRecipe);
router.post("/:id/duplicate", checkAuth, duplicateRecipe);
router.put("/:id", checkAuth, updateRecipe);
router.delete("/:id", checkAuth, deleteRecipe);

export default router;