import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: number;
  name: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (name: string, password: string) => Promise<void>;
  register: (name: string, password: string, confirmPassword: string) => Promise<void>;
  logout: () => Promise<void>;
}

const API_BASE_URL = 'http://localhost:3000/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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

  const login = async (name: string, password: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, password }),
      credentials: 'include'
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Erreur de connexion");
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
      const error = await res.json();
      throw new Error(error.message || "Erreur d'inscription");
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
