import React, { useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRecipes = MOCK_RECIPES.filter(recipe =>
    recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    recipe.countryOfOrigin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '1rem' }}>Découvrez nos Recettes 🍲</h1>
        
        {/* BARRE DE RECHERCHE */}
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Rechercher une recette ou un pays..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: '50px',
              border: '2px solid #dfe6e9',
              fontSize: '1.1rem',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease'
            }}
          />
          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '1.2rem' }}>🔍</span>
        </div>
      </header>

      {filteredRecipes.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '2rem',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {filteredRecipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#636e72' }}>
          <p style={{ fontSize: '1.5rem' }}>Aucune recette trouvée pour "{searchTerm}" 😕</p>
          <button onClick={() => setSearchTerm('')} style={{ color: '#0984e3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}>Voir toutes les recettes</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
