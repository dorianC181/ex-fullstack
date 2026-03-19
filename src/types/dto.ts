export type RegisterData = {
  name: string;
  password: string;
  confirmPassword: string;
};

export type LoginData = {
  name: string;
  password: string;
};

export type CreateRecipeData = {
  name: string;
  ingredients: string[];
  servings: number;
  ovenRequired: boolean;
  specialEquipmentRequired: boolean;
  exoticIngredients: boolean;
  countryOfOrigin: string;
  priceLevel: number;
};

export type UpdateRecipeData = CreateRecipeData;