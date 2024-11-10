import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  username: string;
  userId: number;
  isLoading: boolean;
  login: (token: JwtToken) => void;
  logout: () => Promise<void>;
}

interface JwtToken {
  userId: number;
  username: string;
  admin: boolean;
  iat: number;
  exp: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [userId, setUserId] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        setIsLoading(true);

        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const response = await fetch(`${apiUrl}/auth/verify`, {
          credentials: 'include'
        });

        if (response.status === 200) {
          const data = await response.json();
          setIsAdmin(data.admin);
          setUsername(data.username);
          setUserId(data.userId);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch {
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuth();
  }, []);

  const login = (token: JwtToken) => {
    setIsAdmin(token.admin);
    setUsername(token.username);
    setIsAuthenticated(true);
    setUserId(token.userId);
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_BACKEND_URL;
      await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
      setIsAuthenticated(false);
      setIsAdmin(false);
      setUsername('');
      setUserId(0);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated, isAdmin, username, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
