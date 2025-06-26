import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthTokens, getAccessToken, clearTokens } from '../services/spotifyAuth';
import { getAuthUrl } from '../services/spotifyConfig';
import { UserProfile, getCurrentUserProfile } from '../services/spotifyApi';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: UserProfile | null;
  tokens: AuthTokens | null;
  login: () => void;
  logout: () => void;
  handleAuthCallback: (code: string) => Promise<void>;
  error: string | null;
}

const defaultAuthContext: AuthContextType = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  tokens: null,
  login: () => {},
  logout: () => {},
  handleAuthCallback: async () => {},
  error: null,
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tokens, setTokens] = useState<AuthTokens | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedTokens = localStorage.getItem('spotify_tokens');

        if (!storedTokens) {
          setIsLoading(false);
          return;
        }

        const parsedTokens = JSON.parse(storedTokens) as AuthTokens;
        setTokens(parsedTokens);

        const userProfile = await getCurrentUserProfile();
        setUser(userProfile);
        setIsAuthenticated(true);
      } catch (error) {
        clearTokens();
        setError('Sessão expirada. Por favor, faça login novamente.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = () => {
    window.location.href = getAuthUrl();
  };

  const handleAuthCallback = async (code: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const newTokens = await getAccessToken(code);
      setTokens(newTokens);

      const userProfile = await getCurrentUserProfile();
      setUser(userProfile);
      setIsAuthenticated(true);
    } catch (error) {
      setError('Falha na autenticação. Por favor, tente novamente.');
      clearTokens();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    clearTokens();
    setIsAuthenticated(false);
    setUser(null);
    setTokens(null);
  };

  const contextValue: AuthContextType = {
    isAuthenticated,
    isLoading,
    user,
    tokens,
    login,
    logout,
    handleAuthCallback,
    error,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
