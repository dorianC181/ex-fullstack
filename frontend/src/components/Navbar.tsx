import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <nav style={{
      backgroundColor: 'white',
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <Link to="/" style={{ 
        fontSize: '1.5rem', 
        fontWeight: 800, 
        textDecoration: 'none', 
        color: '#2d3436' 
      }}>
        Cordon<span style={{ color: '#0984e3' }}>Bleu</span> 👨‍🍳
      </Link>

      <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
        <Link to="/" style={{ textDecoration: 'none', color: '#2d3436', fontWeight: 600 }}>Accueil</Link>
        
        {isAuthenticated ? (
          <>
            <Link to="/add" style={{ 
              textDecoration: 'none', 
              color: 'white', 
              backgroundColor: '#00b894', 
              padding: '0.5rem 1rem', 
              borderRadius: '8px',
              fontWeight: 700
            }}>+ Ajouter une recette</Link>
            
            <span style={{ fontWeight: 600, color: '#636e72' }}>{user?.name}</span>
            <button 
              onClick={logout}
              style={{
                backgroundColor: '#fab1a0',
                color: '#d63031',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              Déconnexion
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ textDecoration: 'none', color: '#0984e3', fontWeight: 700 }}>Se connecter</Link>
            <Link to="/register" style={{ 
              textDecoration: 'none', 
              backgroundColor: '#0984e3', 
              color: 'white', 
              padding: '0.6rem 1.2rem', 
              borderRadius: '8px',
              fontWeight: 700
            }}>S'inscrire</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
