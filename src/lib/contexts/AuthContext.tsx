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

    const initAuth = async () => {
      const authenticated = authApi.isAuthenticated();
      if (authenticated) {
        // Verify the token is still valid server-side
        try {
          const res = await fetch('/api/auth/me');
          if (!res.ok) {
            // Token invalid — try refresh
            try {
              await authApi.refreshAccessToken();
              setIsAuthenticated(true);
            } catch {
              authApi.logout();
              setIsAuthenticated(false);
            }
          } else {
            setIsAuthenticated(true);
          }
        } catch {
          // Network error — keep current state
          setIsAuthenticated(authenticated);
        }
      } else {
        setIsAuthenticated(false);
        // Try refresh anyway in case only the access token is stale
        if (authApi.getRefreshToken()) {
          try {
            await authApi.refreshAccessToken();
            setIsAuthenticated(true);
          } catch {
            setIsAuthenticated(false);
          }
        }
      }
    };

    initAuth();

    const refreshInterval = setInterval(async () => {
      if (authApi.getRefreshToken()) {
        try {
          await authApi.refreshAccessToken();
          setIsAuthenticated(true);
        } catch (error) {
          setIsAuthenticated(false);
        }
      }
    }, 5 * 60 * 1000); // Every 5 minutes (matches access token expiry)

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
