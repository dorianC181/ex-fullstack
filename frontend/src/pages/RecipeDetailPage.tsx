import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Recipe } from '../types/recipe';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const res = await fetch(`/api/recipes/${id}`);
        if (res.ok) {
          const data = await res.json();
          setRecipe(data);
        }
      } catch (err) {
        console.error("Fetch recipe failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecipe();
  }, [id]);

  if (isLoading) return <div style={{ textAlign: 'center', padding: '4rem' }}>Chargement de la recette...</div>;
  if (!recipe) return <div style={{ textAlign: 'center', padding: '4rem' }}>Recette introuvable 😕</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Link to="/" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 600 }}>← Retour à l'accueil</Link>
      
      <div style={{ marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{recipe.name}</h1>
        <div style={{ display: 'flex', gap: '1rem', color: '#636e72', marginBottom: '2rem' }}>
          <span>Pays : {recipe.countryOfOrigin}</span>
          <span>Pour : {recipe.servings} personnes</span>
          <span>Vues : {recipe.viewsCount}</span>
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <h3>Ingrédients</h3>
          <ul style={{ lineHeight: '1.8' }}>
            {recipe.ingredients.map((ing, i) => (
              <li key={i}>{ing}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3>Détails techniques</h3>
          <p>Four requis : {recipe.ovenRequired ? "Oui" : "Non"}</p>
          <p>Matériel spécifique : {recipe.specialEquipmentRequired ? "Oui" : "Non"}</p>
          <p>Ingrédients exotiques : {recipe.exoticIngredients ? "Oui" : "Non"}</p>
        </section>

        <div style={{ padding: '1rem', background: '#f5f6fa', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Prix :</strong> {Array(recipe.priceLevel).fill('€').join('')}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
