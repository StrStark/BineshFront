import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface ApiError {
  message: string;
  code?: number;
  details?: string;
}

export interface ApiErrorState {
  error: ApiError | null;
  isError: boolean;
  clearError: () => void;
}

/**
 * Hook for handling API errors at component level
 * Prevents whole page crashes by containing errors within components
 */
export function useApiError(): ApiErrorState & {
  handleError: (error: any) => void;
} {
  const [error, setError] = useState<ApiError | null>(null);
  const { logout } = useAuth();

  const handleError = useCallback((err: any) => {
    console.error('API Error caught by useApiError:', err);

    // Check if it's a 401 error (authentication failed)
    if (err?.code === 401 || err?.status === 401 || err?.message?.includes('401')) {
      console.log('🚪 401 detected, logging out user...');
      logout();
      return;
    }

    // Parse error message
    let errorMessage = 'خطایی در برقراری ارتباط با سرور رخ داد';
    let errorCode: number | undefined;
    let errorDetails: string | undefined;

    if (typeof err === 'string') {
      errorMessage = err;
    } else if (err?.message) {
      errorMessage = err.message;
    } else if (err?.error) {
      errorMessage = err.error;
    }

    if (err?.code) {
      errorCode = err.code;
    } else if (err?.status) {
      errorCode = err.status;
    }

    if (err?.details) {
      errorDetails = err.details;
    }

    setError({
      message: errorMessage,
      code: errorCode,
      details: errorDetails,
    });
  }, [logout]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    error,
    isError: error !== null,
    clearError,
    handleError,
  };
}
