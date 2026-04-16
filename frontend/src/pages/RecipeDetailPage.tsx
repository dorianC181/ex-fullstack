import React from 'react';
import { useParams, Link } from 'react-router-dom';

const RecipeDetailPage = () => {
  const { id } = useParams();

  // Pour l'instant on simule la récupération des données
  const recipeName = id === '1' ? "Ratatouille" : id === '2' ? "Sushi Saumon" : "Gratin de Pâtes";

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
      <Link to="/" style={{ color: '#0984e3', textDecoration: 'none', fontWeight: 600 }}>← Retour à l'accueil</Link>
      
      <div style={{ marginTop: '2rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{recipeName}</h1>
        <div style={{ display: 'flex', gap: '1rem', color: '#636e72', marginBottom: '2rem' }}>
          <span>📍 Pays : Inconnu</span>
          <span>👥 Pour : 4 personnes</span>
          <span>📅 Dernière modif : 16/04/2026</span>
        </div>

        <section style={{ marginBottom: '2rem' }}>
          <h3>Ingrédients</h3>
          <ul style={{ lineHeight: '1.8' }}>
            <li>Ingrédient 1</li>
            <li>Ingrédient 2</li>
            <li>Ingrédient 3</li>
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h3>Matériel nécessaire</h3>
          <p>Four : Non | Matériel spécifique : Non</p>
        </section>

        <div style={{ padding: '1rem', background: '#f5f6fa', borderRadius: '8px', fontSize: '0.9rem' }}>
          <strong>Auteur :</strong> Dorian C.
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailPage;
