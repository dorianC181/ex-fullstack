import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';

const Login = () => <div style={{ padding: '2rem' }}><h2>Page de Connexion</h2></div>;

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
