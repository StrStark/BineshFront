"use client"

import { ReactNode, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
  onRedirect: () => void;
}

export function ProtectedRoute({ children, onRedirect }: ProtectedRouteProps) {
  const { isAuthenticated, checkAuth } = useAuth();

  useEffect(() => {
    const authenticated = checkAuth();
    if (!authenticated) {
      onRedirect();
    }
  }, [checkAuth, onRedirect]);

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
