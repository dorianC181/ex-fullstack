// Point d'entrée principal de l'application React
import { createRoot } from 'react-dom/client';
import App from './App';

// Initialisation du rendu dans l'élément HTML 'root'
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
