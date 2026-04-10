import React from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

const MOCK_RECIPES: Recipe[] = [
  {
    id: 1,
    name: "Ratatouille",
    ingredients: ["Tomates", "Aubergines", "Courgettes"],
    servings: 4,
    ovenRequired: false,
    specialEquipmentRequired: false,
    exoticIngredients: false,
    countryOfOrigin: "France",
    priceLevel: 1,
    createdAt: "",
    updatedAt: "",
    authorId: 1,
    viewsCount: 10
  },
  {
    id: 2,
    name: "Sushi Saumon",
    ingredients: ["Riz", "Saumon", "Algues", "Wasabi"],
    servings: 2,
    ovenRequired: false,
    specialEquipmentRequired: false,
    exoticIngredients: true,
    countryOfOrigin: "Japon",
    priceLevel: 3,
    createdAt: "",
    updatedAt: "",
    authorId: 1,
    viewsCount: 50
  },
  {
    id: 3,
    name: "Gratin de Pâtes",
    ingredients: ["Pâtes", "Crème", "Fromage"],
    servings: 4,
    ovenRequired: true,
    specialEquipmentRequired: true,
    exoticIngredients: true,
    countryOfOrigin: "France",
    priceLevel: 2,
    createdAt: "",
    updatedAt: "",
    authorId: 2,
    viewsCount: 100
  }
];

const HomePage: React.FC = () => {
  return (
    <div style={{ backgroundColor: '#f5f6fa', minHeight: '100vh', padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436' }}>Cordon Bleu 👨‍🍳</h1>
        <p style={{ color: '#636e72' }}>La passion du partage culinaire</p>
      </header>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {MOCK_RECIPES.map(recipe => (
          <RecipeCard key={recipe.id} recipe={recipe} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
