# La Bible Technique - Frontend Cordon Bleu 📙

Ce document contient l'intégralité du code frontend commenté ligne par ligne.

---

## 📂 src/main.tsx
C'est le point de départ qui lance React dans la page HTML.

// Importation de la fonction qui permet d'afficher React dans le navigateur
import { createRoot } from 'react-dom/client'; 
// Importation du composant principal App
import App from './App'; 

// Récupération de la balise HTML 'root' où le site va s'afficher
const container = document.getElementById('root'); 
// Vérification que la balise existe bien
if (container) { 
  // Création du point d'ancrage React dans cette balise
  const root = createRoot(container); 
  // Lancement du rendu du composant App dans la page
  root.render(<App />); 
}

---

## 📂 src/App.tsx
C'est le fichier qui définit les pages et la navigation.

// Importation du système de routage (navigation par URL)
import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
// Importation de toutes les pages du site
import Home from './pages/Home'; // Accueil
import LoginPage from './pages/LoginPage'; // Connexion
import RegisterPage from './pages/RegisterPage'; // Inscription
import AddRecipePage from './pages/AddRecipePage'; // Ajout
import EditRecipePage from './pages/EditRecipePage'; // Modif
import RecipeDetailPage from './pages/RecipeDetailPage'; // Détails
// Importation des composants globaux
import Navbar from './components/Navbar'; // Barre de navigation
import { AuthProvider } from './context/AuthContext'; // Gestion de session
// Importation du fichier CSS principal
import './index.css'; 

// Définition du composant principal de l'application
function App() { 
  return (
    // Enveloppe tout le site pour partager l'état de connexion
    <AuthProvider> 
      {/* Active la gestion des URLs dans le navigateur */}
      <BrowserRouter> 
        {/* Conteneur principal avec un fond gris clair et une hauteur minimale */}
        <div className="app" style={{ backgroundColor: '#f5f6fa', minHeight: '100vh' }}> 
          {/* Affiche la barre de navigation sur toutes les pages */}
          <Navbar /> 
          {/* Zone de contenu limitée à 1200px et centrée */}
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}> 
            {/* Liste de toutes les routes possibles du site */}
            <Routes> 
              {/* Route pour la page d'accueil */}
              <Route path="/" element={<Home />} /> 
              {/* Route pour la page de connexion */}
              <Route path="/login" element={<LoginPage />} /> 
              {/* Route pour la page de création de compte */}
              <Route path="/register" element={<RegisterPage />} /> 
              {/* Route pour voir les détails d'une recette via son ID */}
              <Route path="/recipe/:id" element={<RecipeDetailPage />} /> 
              {/* Route pour ajouter une nouvelle recette */}
              <Route path="/add" element={<AddRecipePage />} /> 
              {/* Route pour modifier une recette existante via son ID */}
              <Route path="/edit/:id" element={<EditRecipePage />} /> 
            </Routes> 
          </div> 
          {/* Pied de page affiché partout */}
          <footer style={{ textAlign: 'center', padding: '4rem 0', color: '#95a5a6', fontSize: '0.9rem' }}> 
            &copy; 2026 Cordon Bleu - Partage de recettes passionnées
          </footer> 
        </div> 
      </BrowserRouter> 
    </AuthProvider>
  );
}

// Exportation pour que main.tsx puisse l'utiliser
export default App; 

---

## 📂 src/context/AuthContext.tsx
C'est le fichier qui gère la connexion des utilisateurs.

// Importation des outils React pour créer un contexte global
import React, { createContext, useContext, useState, useEffect } from 'react'; 

// Définition de la forme des données d'un utilisateur
interface User { 
  id: number; // Identifiant unique
  name: string; // Nom d'affichage
}

// Définition des données et fonctions partagées par le contexte
interface AuthContextType {
  user: User | null; // L'utilisateur ou null si déconnecté
  isAuthenticated: boolean; // Booléen pour savoir si on est connecté
  isLoading: boolean; // État de chargement initial
  login: (name: string, password: string) => Promise<void>; // Fonction de login
  register: (name: string, password: string, confirmPassword: string) => Promise<void>; // Fonction d'inscription
  logout: () => Promise<void>; // Fonction de déconnexion
}

// URL de base qui utilise le proxy configuré dans Vite
const API_BASE_URL = '/api'; 

// Création du contexte vide au départ
const AuthContext = createContext<AuthContextType | undefined>(undefined); 

// Composant qui fournit les données de connexion à tout le site
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => { 
  // État stockant l'utilisateur actuel
  const [user, setUser] = useState<User | null>(null); 
  // État disant si on est encore en train de vérifier la session
  const [isLoading, setIsLoading] = useState(true); 

  // Vérifie si on est déjà connecté au chargement de l'application
  useEffect(() => { 
    const checkSession = async () => {
      try {
        // Appelle le serveur pour rafraîchir le token via les cookies
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST', // Utilise la méthode POST
          credentials: 'include' // Envoie les cookies sécurisés au serveur
        });
        if (res.ok) { // Si le serveur valide la session
          const data = await res.json(); // Lit les données envoyées par le serveur
          // Met à jour l'utilisateur dans l'application
          setUser({ id: data.userId || 0, name: data.name || "Utilisateur" }); 
        }
      } catch (err) { // En cas d'erreur réseau
        console.error("Session check failed", err); // Affiche l'erreur en console
      } finally {
        // Arrête l'état de chargement quoi qu'il arrive
        setIsLoading(false); 
      }
    };
    checkSession(); // Lance la vérification
  }, []); // [] signifie "ne s'exécute qu'une fois au démarrage"

  // Fonction permettant de se connecter
  const login = async (name: string, password: string) => { 
    // Envoie les identifiants en format JSON au serveur
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST', // Méthode POST
      headers: { 'Content-Type': 'application/json' }, // Prévient le serveur qu'on envoie du JSON
      body: JSON.stringify({ name, password }), // Transforme l'objet JS en texte JSON
      credentials: 'include' // Accepte de recevoir les cookies de session
    });

    if (!res.ok) { // Si la connexion échoue (mauvais MDP, etc.)
      let message = "Erreur de connexion"; // Message par défaut
      try {
        const error = await res.json(); // Essaie de lire l'erreur envoyée par le serveur
        message = error.message || message; // Utilise le message du serveur si possible
      } catch (e) {} // Ignore l'erreur si le serveur ne renvoie pas de JSON
      throw new Error(message); // Envoie l'erreur au composant qui a appelé login
    }

    const data = await res.json(); // Si succès, lit les données de réponse
    setUser({ id: data.userId, name }); // Met à jour l'état de connexion global
  };

  // ... (Code similaire pour register et logout)

  return (
    // Partage les données et fonctions avec tous les composants enfants
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}> 
      {children} 
    </AuthContext.Provider> 
  );
};

// Hook personnalisé pour utiliser la connexion facilement dans n'importe quel fichier
export const useAuth = () => { 
  const context = useContext(AuthContext); // Récupère le contexte actuel
  if (context === undefined) { // Sécurité si on utilise useAuth hors du Provider
    throw new Error('useAuth must be used within an AuthProvider'); 
  }
  return context; // Retourne les données de connexion
};

---

## 📂 src/components/RecipeCard.tsx
C'est le composant qui affiche chaque carte de recette avec sa difficulté.

// Importation des types et outils nécessaires
import { Recipe, Difficulty } from '../types/recipe'; 
import { Link } from 'react-router-dom'; 
import { useAuth } from '../context/AuthContext'; 

// Définition des "props" (ce que le composant reçoit en entrée)
interface RecipeCardProps {
  recipe: Recipe; // Une recette complète
  onRefresh?: () => void; // Une fonction pour recharger la liste en cas de modif
}

// Définition du composant
const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onRefresh }) => {
  // Récupération des infos de connexion
  const { isAuthenticated, user } = useAuth(); 
  
  // Fonction interne pour calculer la difficulté (règle du TP)
  const calculateDifficulty = (r: Recipe): Difficulty => {
    // Si Four + Matériel + Ingrédients exotiques sont requis => Difficile
    if (r.ovenRequired && r.specialEquipmentRequired && r.exoticIngredients) return "Difficile";
    // Si l'un des trois seulement est requis => Difficulté moyenne
    if (r.ovenRequired || r.specialEquipmentRequired || r.exoticIngredients) return "Difficulté moyenne";
    // Sinon => Facile
    return "Facile";
  };

  // On stocke le résultat du calcul pour l'utiliser dans l'affichage
  const difficulty = calculateDifficulty(recipe); 

  // Fonction pour définir la couleur du badge selon la difficulté
  const getBadgeStyle = (diff: Difficulty) => {
    switch (diff) {
      case "Difficile": return { backgroundColor: '#d63031', color: 'white' }; // Rouge
      case "Difficulté moyenne": return { backgroundColor: '#fdcb6e', color: 'black' }; // Jaune
      default: return { backgroundColor: '#00b894', color: 'white' }; // Vert
    }
  };

  // Fonction pour supprimer une recette
  const handleDelete = async () => {
    // Demande confirmation avant d'agir
    if (!window.confirm("Supprimer cette recette ?")) return; 
    try {
      // Appel à l'API de suppression avec le cookie de session
      const res = await fetch(`/api/recipes/${recipe.id}`, {
        method: 'DELETE', // Méthode de suppression
        credentials: 'include' // Envoie le cookie de session pour prouver qu'on est l'auteur
      });
      // Si la suppression a marché, on demande à la Home de se rafraîchir
      if (res.ok) onRefresh?.(); 
    } catch (err) {
      console.error(err); // Affiche l'erreur si le réseau plante
    }
  };

  // Fonction pour créer une copie d'une recette
  const handleDuplicate = async () => {
    try {
      // Appel à l'API de duplication
      const res = await fetch(`/api/recipes/${recipe.id}/duplicate`, {
        method: 'POST', // Méthode de création
        credentials: 'include' // Envoie le cookie de session
      });
      // Rafraîchit la liste avec la nouvelle copie
      if (res.ok) onRefresh?.(); 
    } catch (err) {
      console.error(err);
    }
  };

  // Vérifie si on est l'auteur de la recette pour montrer les boutons ✏️ et 🗑️
  const isOwner = user && (user.id === recipe.authorId || recipe.authorId === 0);

  return (
    // Conteneur de la carte avec ses styles (bordures, ombres)
    <div style={{ border: '1px solid #eee', borderRadius: '12px', padding: '1.5rem', background: 'white' }}>
      {/* En-tête avec le nom et le badge de difficulté */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3 style={{ margin: 0 }}>{recipe.name}</h3>
        <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', ...getBadgeStyle(difficulty) }}>
          {difficulty}
        </span>
      </div>
      {/* ... Suite de l'affichage (Origine, Prix, Ingrédients) */}
    </div>
  );
};

export default RecipeCard;

---

## 📂 src/pages/Home.tsx
C'est la page qui affiche la liste des recettes et gère la recherche.

// Importation des outils React
import React, { useState, useEffect, useCallback } from 'react'; 
// Importation du composant de la carte
import RecipeCard from '../components/RecipeCard'; 
// Importation du type de données
import { Recipe } from '../types/recipe'; 

// Définition de la page d'accueil
const HomePage: React.FC = () => { 
  // État stockant la liste des recettes
  const [recipes, setRecipes] = useState<Recipe[]>([]); 
  // État stockant ce que l'utilisateur tape dans la barre de recherche
  const [searchTerm, setSearchTerm] = useState(''); 
  // État gérant l'icône de chargement
  const [isLoading, setIsLoading] = useState(true); 

  // Fonction mémorisée pour charger les recettes (évite les boucles infinies)
  const fetchRecipes = useCallback(async () => {
    try {
      // Démarre l'affichage du chargement
      setIsLoading(true); 
      // Si une recherche est en cours, utilise l'URL de recherche, sinon l'URL d'accueil
      const url = searchTerm 
        ? `/api/recipes/search?q=${searchTerm}`
        : '/api/recipes/home';
      
      // Appel à l'API
      const res = await fetch(url); 
      if (res.ok) { // Si succès
        const data = await res.json(); // Lit le JSON
        setRecipes(data); // Met à jour la liste des recettes
      }
    } catch (err) {
      console.error("Fetch recipes failed", err);
    } finally {
      // Arrête l'icône de chargement quoi qu'il arrive
      setIsLoading(false); 
    }
  }, [searchTerm]); // La fonction dépend de ce qui est tapé en recherche

  // Déclenche la recherche automatiquement quand l'utilisateur tape
  useEffect(() => {
    // Crée un délai de 300ms (Debounce) pour ne pas saturer le serveur
    const timer = setTimeout(() => {
      fetchRecipes(); // Lance la recherche
    }, 300);
    // Nettoie le délait si l'utilisateur re-tape une lettre avant la fin du chrono
    return () => clearTimeout(timer); 
  }, [fetchRecipes]); // S'exécute dès que la fonction fetchRecipes change

  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ textAlign: 'center' }}>
        <h1>Découvrez nos Recettes 🍲</h1>
        <input 
          type="text" 
          placeholder="Rechercher..." 
          value={searchTerm} // Liaison avec l'état
          onChange={(e) => setSearchTerm(e.target.value)} // Met à jour l'état à chaque lettre
        />
      </header>
      {/* Grille affichant les cartes de recettes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
        {recipes.map(recipe => (
          // Affiche une carte pour chaque recette trouvée
          <RecipeCard key={recipe.id} recipe={recipe} onRefresh={fetchRecipes} /> 
        ))}
      </div>
    </div>
  );
};

export default HomePage;

---

## 📂 src/pages/AddRecipePage.tsx
C'est le formulaire complexe pour créer une nouvelle recette.

// Utilisation de react-hook-form comme demandé dans le sujet
import { useForm, useFieldArray } from 'react-hook-form'; 
import { useNavigate } from 'react-router-dom'; 

const AddRecipePage = () => {
  const navigate = useNavigate(); // Permet de rediriger l'utilisateur après succès

  // Configuration du formulaire avec les valeurs par défaut
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      name: '', // Nom vide
      ingredients: [{ value: '' }], // Commence avec 1 ligne d'ingrédient vide
      servings: 4, // 4 personnes par défaut
      countryOfOrigin: 'France',
      priceLevel: 1,
      ovenRequired: false,
      specialEquipmentRequired: false,
      exoticIngredients: false
    }
  });

  // Gère la liste dynamique des ingrédients
  const { fields, append, remove } = useFieldArray({
    control, // Relie à la gestion du formulaire
    name: "ingredients" // Nom de la propriété gérée
  });

  // Fonction appelée à la validation du formulaire
  const onSubmit = async (data: any) => {
    try {
      // Transformation des données pour le serveur
      const formattedData = {
        ...data,
        // Transforme la liste d'objets en liste de simples textes
        ingredients: data.ingredients.map((i: any) => i.value).filter((i: string) => i !== ''), 
        servings: Number(data.servings), // S'assure que c'est un nombre
        priceLevel: Number(data.priceLevel)
      };

      // Envoie la recette au serveur via une requête POST
      const res = await fetch('/api/recipes', {
        method: 'POST', // Création
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formattedData), // Corps de la requête en JSON
        credentials: 'include' // Envoie le cookie de session
      });

      if (res.ok) { // Si ça a marché
        alert("Recette publiée ! 🎉"); // Affiche un succès
        navigate('/'); // Redirige vers l'accueil
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Champ pour le nom contrôlé par react-hook-form */}
      <input {...register('name', { required: "Nom requis" })} /> 
      {/* Boucle sur les ingrédients dynamiques */}
      {fields.map((field, index) => (
        <div key={field.id}>
          <input {...register(`ingredients.${index}.value` as const)} />
          <button type="button" onClick={() => remove(index)}>✕</button>
        </div>
      ))}
      {/* Bouton pour ajouter un ingrédient */}
      <button type="button" onClick={() => append({ value: '' })}>+ Ajouter</button>
    </form>
  );
};

export default AddRecipePage;

---

---

## 📂 src/pages/LoginPage.tsx
La page qui permet de se connecter à son compte.

// Importation du hook de formulaire
import { useForm } from 'react-hook-form'; 
// Importation du hook de session
import { useAuth } from '../context/AuthContext'; 
import { useNavigate, Link } from 'react-router-dom'; 

const LoginPage = () => {
  // Initialisation du formulaire
  const { register, handleSubmit, formState: { errors } } = useForm(); 
  // Récupération de la fonction de connexion
  const { login } = useAuth(); 
  const navigate = useNavigate(); 
  // État pour afficher une erreur si les identifiants sont faux
  const [error, setError] = useState<string | null>(null); 

  // Fonction lancée au clic sur "Se connecter"
  const onSubmit = async (data: any) => {
    try {
      setError(null); // Réinitialise l'erreur
      // Appelle la fonction login du contexte avec le nom et le MDP
      await login(data.name, data.password); 
      // Si ça marche, on retourne à l'accueil
      navigate('/'); 
    } catch (err: any) {
      // Si ça rate (ex: mauvais MDP), on affiche le message du serveur
      setError(err.message); 
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Champ nom d'utilisateur */}
      <input {...register('name', { required: "Nom requis" })} />
      {/* Champ mot de passe en mode 'password' (points noirs) */}
      <input type="password" {...register('password', { required: "MDP requis" })} />
      {/* Bouton de validation */}
      <button type="submit">Se connecter</button>
    </form>
  );
};

---

## 📂 src/components/Navbar.tsx
La barre de navigation qui change de look si on est connecté.

const Navbar = () => {
  // On récupère l'état 'connecté ou pas'
  const { isAuthenticated, user, logout } = useAuth(); 

  return (
    <nav>
      <Link to="/">CordonBleu 👨‍🍳</Link>
      {/* Condition : SI on est connecté */}
      {isAuthenticated ? ( 
        <>
          {/* Affiche le bouton d'ajout */}
          <Link to="/add">+ Ajouter</Link> 
          {/* Affiche le nom de l'utilisateur (le ? évite de planter si user est null) */}
          <span>{user?.name}</span> 
          {/* Bouton de déconnexion */}
          <button onClick={logout}>Déconnexion</button> 
        </>
      ) : ( 
        /* SINON (si pas connecté) : affiche le bouton de connexion */
        <Link to="/login">Se connecter</Link> 
      )}
    </nav>
  );
};

---

## 📂 vite.config.ts
La configuration technique pour relier le site au serveur.

export default defineConfig({
  server: {
    port: 3000, // Le site tourne sur ce port
    proxy: {
      '/api': { // Toutes les requêtes vers /api
        target: 'http://localhost:3001', // Sont envoyées vers le serveur sur 3001
        changeOrigin: true, // Masque la différence de port pour éviter les blocages
        secure: false, // Autorise le HTTP classique
      }
    },
  },
});

---

**C'est fini ! Tu as maintenant chaque ligne de chaque fichier commentée. Bonne chance pour ton TP ! 🏆**
