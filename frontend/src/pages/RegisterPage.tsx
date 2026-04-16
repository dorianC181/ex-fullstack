// Importation des outils de formulaire, de session et de navigation
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const RegisterPage = () => {
  // Initialisation des hooks de gestion de formulaire et d'authentification
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  // Fonction de gestion de la soumission de l'inscription
  const onSubmit = async (data: any) => {
    try {
      setError(null);
      await registerUser(data.name, data.password, data.confirmPassword);
      alert("Compte créé avec succès ! Connectez-vous.");
      navigate('/login');
    } catch (err: any) {
      setError(err.message);
    }
  };

  const password = watch("password");

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh' }}>
      <form onSubmit={handleSubmit(onSubmit)} style={{
        background: 'white',
        padding: '2.5rem',
        borderRadius: '16px',
        boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '400px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem'
      }}>
        <h2 style={{ textAlign: 'center', margin: 0 }}>Inscription</h2>
        
        {error && <div style={{ color: 'red', fontSize: '0.9rem', textAlign: 'center' }}>{error}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Nom d'utilisateur</label>
          <input 
            {...register('name', { required: "Le nom est requis" })}
            type="text" 
            placeholder="Dorian"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} 
          />
          {errors.name && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.name.message as string}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Mot de passe</label>
          <input 
            {...register('password', { required: "Le mot de passe est requis", minLength: { value: 6, message: "6 caractères minimum" } })}
            type="password" 
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} 
          />
          {errors.password && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password.message as string}</span>}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Confirmer le mot de passe</label>
          <input 
            {...register('confirmPassword', { 
              required: "Veuillez confirmer", 
              validate: value => value === password || "Les mots de passe ne correspondent pas" 
            })}
            type="password" 
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} 
          />
          {errors.confirmPassword && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.confirmPassword.message as string}</span>}
        </div>

        <button type="submit" style={{
          padding: '1rem',
          backgroundColor: '#00b894',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          Créer mon compte
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
          Déjà un compte ? <Link to="/login" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 600 }}>Se connecter</Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
