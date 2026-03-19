export type DbUser = {
  id: number;
  name: string;
  passwordHash: string;
};

export type DbRecipe = {
  id: number;
  name: string;
  ingredients: string;
  servings: number;
  oven_required: number;
  special_equipment_required: number;
  exotic_ingredients: number;
  country_of_origin: string;
  price_level: number;
  created_at: Date;
  updated_at: Date;
  author_id: number;
  views_count: number;
  last_viewed_at: Date | null;
};