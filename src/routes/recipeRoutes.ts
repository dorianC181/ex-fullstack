import { Router } from "express";
import { getAllRecipes, createRecipe } from "../controllers/recipeController";
import { checkAuth } from "../middlewares/checkAuth";

const router = Router();

router.get("/", getAllRecipes);
router.post("/", checkAuth, createRecipe);

export default router;