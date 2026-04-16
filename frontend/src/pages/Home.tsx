import React, { useState, useEffect, useCallback } from 'react';
import RecipeCard from '../components/RecipeCard';
import { Recipe } from '../types/recipe';

const HomePage: React.FC = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchRecipes = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = searchTerm 
        ? `/api/recipes/search?q=${searchTerm}`
        : '/api/recipes/home';
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setRecipes(data);
      }
    } catch (err) {
      console.error("Fetch recipes failed", err);
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    // Petit debounce pour la recherche
    const timer = setTimeout(() => {
      fetchRecipes();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchRecipes]);

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#2d3436', marginBottom: '1rem' }}>Découvrez nos Recettes 🍲</h1>
        
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <input 
            type="text" 
            placeholder="Rechercher une recette..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '1rem 1.5rem',
              borderRadius: '50px',
              border: '2px solid #dfe6e9',
              fontSize: '1.1rem',
              outline: 'none',
              boxShadow: '0 4px 15px rgba(0,0,0,0.05)'
            }}
          />
          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)' }}>🔍</span>
        </div>
      </header>

      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement des recettes...</div>
      ) : recipes.length > 0 ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem'
        }}>
          {recipes.map(recipe => (
            <RecipeCard key={recipe.id} recipe={recipe} onRefresh={fetchRecipes} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#636e72' }}>
          <p style={{ fontSize: '1.2rem' }}>Aucune recette trouvée 😕</p>
          {searchTerm && <button onClick={() => setSearchTerm('')} style={{ color: '#0984e3', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800 }}>Voir tout</button>}
        </div>
      )}
    </div>
  );
};

export default HomePage;
