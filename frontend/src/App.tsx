import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Navbar from './components/Navbar';
import RecipeDetailPage from './pages/RecipeDetailPage';
import { AuthProvider } from './context/AuthContext';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app" style={{ backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/recipe/:id" element={<RecipeDetailPage />} />
          </Routes>
          
          <footer style={{ textAlign: 'center', padding: '4rem 0', color: '#95a5a6', fontSize: '0.9rem' }}>
            &copy; 2026 Cordon Bleu - Partage de recettes passionnées
          </footer>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
