export interface Recipe {
  id: number;
  name: string;
  ingredients: string[];
  servings: number;
  ovenRequired: boolean;
  specialEquipmentRequired: boolean;
  exoticIngredients: boolean;
  countryOfOrigin: string;
  priceLevel: number; // 1 to 5
  createdAt: string;
  updatedAt: string;
  authorId: number;
  viewsCount: number;
}

export type Difficulty = "Facile" | "Difficulté moyenne" | "Difficile";
