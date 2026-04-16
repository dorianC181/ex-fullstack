import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

const LoginPage = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (data: any) => {
    try {
      setError(null);
      await login(data.name, data.password);
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
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
        <h2 style={{ textAlign: 'center', margin: 0 }}>Connexion 👨‍🍳</h2>
        
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
            {...register('password', { required: "Le mot de passe est requis" })}
            type="password" 
            placeholder="••••••••"
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} 
          />
          {errors.password && <span style={{ color: 'red', fontSize: '0.8rem' }}>{errors.password.message as string}</span>}
        </div>

        <button type="submit" style={{
          padding: '1rem',
          backgroundColor: '#0984e3',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontWeight: 700,
          cursor: 'pointer'
        }}>
          Se connecter
        </button>

        <p style={{ textAlign: 'center', fontSize: '0.9rem', margin: 0 }}>
          Pas de compte ? <Link to="/register" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 600 }}>Créer un compte</Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
