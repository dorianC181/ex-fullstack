import { Recipe, Difficulty } from '../types/recipe';
import { Link } from 'react-router-dom';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  // --- LOGIQUE MÉTIER DU TP ---
  const calculateDifficulty = (r: Recipe): Difficulty => {
    if (r.ovenRequired && r.specialEquipmentRequired && r.exoticIngredients) {
      return "Difficile";
    }
    if (r.ovenRequired || r.specialEquipmentRequired || r.exoticIngredients) {
      return "Difficulté moyenne";
    }
    return "Facile";
  };

  const difficulty = calculateDifficulty(recipe);

  const getBadgeStyle = (diff: Difficulty) => {
    switch (diff) {
      case "Difficile": return { backgroundColor: '#d63031', color: 'white' };
      case "Difficulté moyenne": return { backgroundColor: '#fdcb6e', color: 'black' };
      default: return { backgroundColor: '#00b894', color: 'white' };
    }
  };

  return (
    <div style={{
      border: '1px solid #dfe6e9',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: 'white',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{recipe.name}</h3>
        <span style={{
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          ...getBadgeStyle(difficulty)
        }}>
          {difficulty}
        </span>
      </div>

      <p style={{ color: '#636e72', fontSize: '0.9rem', margin: 0 }}>
        🌍 Origine : {recipe.countryOfOrigin}
      </p>

      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#2d3436' }}>
        <span>👥 {recipe.servings} pers.</span>
        <span>💰 Prix : {Array(recipe.priceLevel).fill('€').join('')}</span>
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem' }}>
        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.9rem' }}>
          {recipe.ingredients.slice(0, 3).map((ing, i) => (
            <li key={i}>{ing}</li>
          ))}
          {recipe.ingredients.length > 3 && <li>...</li>}
        </ul>
      </div>

      <Link to={`/recipe/${recipe.id}`} style={{
        marginTop: 'auto',
        padding: '10px',
        backgroundColor: '#0984e3',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
        textDecoration: 'none',
        textAlign: 'center'
      }}>
        Voir les détails
      </Link>
    </div>
  );
};

export default RecipeCard;
