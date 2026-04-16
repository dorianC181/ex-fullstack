import { Recipe, Difficulty } from '../types/recipe';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface RecipeCardProps {
  recipe: Recipe;
  onRefresh?: () => void;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRefresh }) => {
  const { isAuthenticated, user } = useAuth();
  
  const calculateDifficulty = (r: Recipe): Difficulty => {
    if (r.ovenRequired && r.specialEquipmentRequired && r.exoticIngredients) return "Difficile";
    if (r.ovenRequired || r.specialEquipmentRequired || r.exoticIngredients) return "Difficulté moyenne";
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

  const handleDelete = async () => {
    if (!window.confirm("Supprimer cette recette ?")) return;
    try {
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) onRefresh?.();
      else alert("Erreur lors de la suppression");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDuplicate = async () => {
    try {
      const res = await fetch(`/api/recipes/${recipe.id}/duplicate`, {
        method: 'POST',
        credentials: 'include'
      });
      if (res.ok) onRefresh?.();
      else alert("Erreur lors de la duplication");
    } catch (err) {
      console.error(err);
    }
  };

  // On affiche les boutons d'édition seulement si l'utilisateur est l'auteur (ou simplement s'il est connecté pour le TP)
  const isOwner = user && (user.id === recipe.authorId || recipe.authorId === 0);

  return (
    <div style={{
      border: '1px solid #dfe6e9',
      borderRadius: '12px',
      padding: '1.5rem',
      backgroundColor: 'white',
      shadowColor: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      position: 'relative'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{recipe.name}</h3>
        <span style={{
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 'bold',
          ...getBadgeStyle(difficulty)
        }}>{difficulty}</span>
      </div>

      <p style={{ color: '#636e72', fontSize: '0.85rem', margin: 0 }}>🌍 {recipe.countryOfOrigin}</p>

      <div style={{ display: 'flex', gap: '0.8rem', fontSize: '0.8rem' }}>
        <span>👥 {recipe.servings} pers.</span>
        <span>💰 {Array(recipe.priceLevel).fill('€').join('')}</span>
      </div>

      <div style={{ borderTop: '1px solid #eee', paddingTop: '0.8rem' }}>
        <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.85rem' }}>
          {recipe.ingredients.slice(0, 2).map((ing, i) => <li key={i}>{ing}</li>)}
          {recipe.ingredients.length > 2 && <li>...</li>}
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
        <Link to={`/recipe/${recipe.id}`} style={{
          flex: 1,
          padding: '8px',
          backgroundColor: '#0984e3',
          color: 'white',
          borderRadius: '6px',
          textDecoration: 'none',
          textAlign: 'center',
          fontSize: '0.9rem',
          fontWeight: 600
        }}>Détails</Link>

        {isAuthenticated && (
          <>
            <button onClick={handleDuplicate} title="Dupliquer" style={{ padding: '8px', backgroundColor: '#55efc4', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>👯</button>
            {isOwner && (
              <>
                <Link to={`/edit/${recipe.id}`} title="Modifier" style={{ padding: '8px', backgroundColor: '#ffeaa7', borderRadius: '6px', textDecoration: 'none', textAlign: 'center' }}>✏️</Link>
                <button onClick={handleDelete} title="Supprimer" style={{ padding: '8px', backgroundColor: '#ff7675', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>🗑️</button>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeCard;
