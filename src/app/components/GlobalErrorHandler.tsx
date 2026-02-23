import { useEffect } from 'react';

/**
 * 🛡️ Global error handler for catching ALL errors including Figma DevTools
 * This suppresses "Failed to fetch" errors that don't affect the app
 */
export function GlobalErrorHandler() {
  useEffect(() => {
    // Store original console methods
    const originalConsoleError = console.error;
    const originalConsoleWarn = console.warn;

    // Override console.error to filter out Figma errors completely
    console.error = (...args: any[]) => {
      // Convert arguments to string for checking
      const errorString = String(args[0] || '');
      const fullString = args.map(a => String(a)).join(' ');
      
      // Completely ignore Figma errors
      if (fullString.includes('figma.com') || 
          fullString.includes('devtools_worker') ||
          fullString.includes('webpack-artifacts')) {
        return; // Silent - don't log anything
      }
      
      // Completely ignore "Failed to fetch" that's not from our API
      if (fullString.includes('Failed to fetch') && !fullString.includes('panel.bineshafzar.ir')) {
        return; // Silent - don't log anything
      }
      
      // Convert ALL other errors to warnings (including our API errors)
      console.warn('⚠️', ...args);
    };

    // Handle unhandled promise rejections
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      // Get error details
      const errorMessage = event.reason?.message || String(event.reason || '');
      const errorStack = event.reason?.stack || '';
      
      // Check if it's from Figma DevTools (completely silent)
      const isFigmaError = 
        errorStack.includes('figma.com') ||
        errorStack.includes('devtools_worker') ||
        errorStack.includes('webpack-artifacts');
      
      if (isFigmaError) {
        event.preventDefault();
        return;
      }
      
      // Check if it's a fetch error
      const isFetchError = 
        errorMessage.includes('fetch') || 
        errorMessage.includes('Failed to fetch');
      
      if (isFetchError) {
        event.preventDefault();
        
        // Only log if it's our API
        if (errorMessage.includes('panel.bineshafzar.ir')) {
          console.warn('⚠️ API Error (handled):', errorMessage);
        }
        return;
      }
      
      // For all other errors, log as warning and prevent
      console.warn('⚠️ Promise rejection (handled):', event.reason);
      event.preventDefault();
    };

    // Handle global errors
    const handleError = (event: ErrorEvent) => {
      // Get error details
      const errorMessage = event.message || event.error?.message || '';
      const errorStack = event.error?.stack || '';
      const filename = event.filename || '';
      
      // Check if it's from Figma DevTools (completely silent)
      const isFigmaError = 
        errorStack.includes('figma.com') ||
        errorStack.includes('devtools_worker') ||
        errorStack.includes('webpack-artifacts') ||
        filename.includes('figma.com');
      
      if (isFigmaError) {
        event.preventDefault();
        return;
      }
      
      // Check if it's a fetch error
      const isFetchError = 
        errorMessage.includes('fetch') || 
        errorMessage.includes('Failed to fetch');
      
      if (isFetchError) {
        event.preventDefault();
        
        // Only log if it's our API
        if (errorMessage.includes('panel.bineshafzar.ir')) {
          console.warn('⚠️ Network Error (handled):', errorMessage);
        }
        return;
      }
      
      // For all other errors, log as warning and prevent
      console.warn('⚠️ Global error (handled):', event.error || event.message);
      event.preventDefault();
    };

    // Add event listeners
    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleError);

    // Cleanup
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleError);
      
      // Restore original console methods
      console.error = originalConsoleError;
      console.warn = originalConsoleWarn;
    };
  }, []);

  return null;
}