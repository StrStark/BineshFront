"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '../utils/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
  checkAuth: () => boolean;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return authApi.isAuthenticated();
    }
    return false;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const authenticated = authApi.isAuthenticated();
    setIsAuthenticated(authenticated);

    const refreshInterval = setInterval(async () => {
      if (authApi.isAuthenticated() && authApi.getRefreshToken()) {
        try {
          await authApi.refreshAccessToken();
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, []);

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    authApi.logout();
    setIsAuthenticated(false);
  };

  const checkAuth = () => {
    const authenticated = authApi.isAuthenticated();
    setIsAuthenticated(authenticated);
    return authenticated;
  };

  const refreshToken = async () => {
    try {
      await authApi.refreshAccessToken();
      setIsAuthenticated(true);
    } catch (error) {
      setIsAuthenticated(false);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, checkAuth, refreshToken }}>
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
