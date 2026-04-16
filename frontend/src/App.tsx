// Importation des outils de routage et des composants de pages
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AddRecipePage from './pages/AddRecipePage';
import EditRecipePage from './pages/EditRecipePage';
import Navbar from './components/Navbar';
import RecipeDetailPage from './pages/RecipeDetailPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  // Rendu principal de l'application avec le fournisseur d'authentification et le routeur
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app" style={{ backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
          <Navbar />
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Routes>
              {/* Définition des chemins (URL) et des composants correspondants */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/recipe/:id" element={<RecipeDetailPage />} />
              <Route path="/add" element={<AddRecipePage />} />
              <Route path="/edit/:id" element={<EditRecipePage />} />
            </Routes>
          </div>
          
          <footer style={{ textAlign: 'center', padding: '4rem 0', color: '#95a5a6', fontSize: '0.9rem' }}>
            &copy; 2026 Cordon Bleu - Partage de recettes passionnées
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
