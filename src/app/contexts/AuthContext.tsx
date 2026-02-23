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
    // Check auth on initial load
    return authApi.isAuthenticated();
  });

  useEffect(() => {
    // Check authentication on mount
    const authenticated = authApi.isAuthenticated();
    setIsAuthenticated(authenticated);

    // Set up token refresh interval (refresh every 50 minutes if token expires in 60 minutes)
    const refreshInterval = setInterval(async () => {
      if (authApi.isAuthenticated() && authApi.getRefreshToken()) {
        try {
          await authApi.refreshAccessToken();
          console.log('✅ Token auto-refreshed successfully');
          setIsAuthenticated(true);
        } catch (error) {
          console.error('❌ Auto token refresh failed:', error);
          setIsAuthenticated(false);
        }
      }
    }, 50 * 60 * 1000); // 50 minutes

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
      console.error('Token refresh failed:', error);
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