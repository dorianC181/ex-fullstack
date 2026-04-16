// Importation des outils React nécessaires
import React, { createContext, useContext, useState, useEffect } from 'react';

// Définition de la structure d'un utilisateur
interface User {
  id: number;
  name: string;
}

// Définition des données et fonctions partagées par le contexte d'authentification
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

// Création du contexte d'authentification
const API_BASE_URL = '/api';
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Composant fournisseur qui entoure l'application pour gérer la session
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effet pour vérifier si l'utilisateur est déjà connecté au chargement du site
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: 'POST',
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser({ id: data.userId || 0, name: data.name || "Utilisateur" });
        }
      } catch (err) {
        console.error("Session check failed", err);
      } finally {
        setIsLoading(false);
      }
    };
    checkSession();
  }, []);

  // Fonction permettant de se connecter au serveur
  const login = async (name: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
      credentials: 'include'
    });

    if (!res.ok) {
      let message = "Erreur de connexion";
      try {
        const error = await res.json();
        message = error.message || message;
      } catch (e) {}
      throw new Error(message);
    }

    const data = await res.json();
    setUser({ id: data.userId, name });
  };

  const register = async (name: string, password: string, confirmPassword: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password, confirmPassword }),
      credentials: 'include'
    });

    if (!res.ok) {
      let message = "Erreur d'inscription";
      try {
        const error = await res.json();
        message = error.message || message;
      } catch (e) {}
      throw new Error(message);
    }
  };

  const logout = async () => {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser facilement les données de session partout
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
