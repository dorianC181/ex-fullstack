import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

const Home = () => (
  <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
    <h1 style={{ color: '#000000ff' }}> Cordon Bleu </h1>
    <p>Bienvenue sur votre application de partage de recettes.</p>
    <nav>
      <Link to="/">Accueil</Link> | <Link to="/login">Connexion</Link>
    </nav>
    <hr />
    <h2>Les Recettes</h2>
    <ul>
      <li>Ratatouille (Facile)</li>
      <li>Bœuf Bourguignon (Difficile)</li>
    </ul>
  </div>
);

const Login = () => <div style={{ padding: '2rem' }}><h2>Page de Connexion</h2><Link to="/">Retour</Link></div>;

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}
