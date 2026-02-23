import { useState, useEffect } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';
import { useCurrentColors } from '../contexts/ThemeColorsContext';

export function ApiConnectionStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);
  const colors = useCurrentColors();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check initial state
    if (!navigator.onLine) {
      setShowOfflineMessage(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-hide message after 5 seconds when online
  useEffect(() => {
    if (isOnline && showOfflineMessage) {
      const timer = setTimeout(() => {
        setShowOfflineMessage(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOnline, showOfflineMessage]);

  if (!showOfflineMessage) return null;

  return (
    <div
      className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] px-4 py-3 rounded-lg shadow-lg border animate-fadeIn"
      style={{
        backgroundColor: isOnline ? colors.success : colors.error,
        borderColor: isOnline ? colors.success : colors.error,
      }}
      dir="rtl"
    >
      <div className="flex items-center gap-3 text-white">
        {isOnline ? (
          <>
            <Wifi className="w-5 h-5" />
            <span className="text-sm font-medium">اتصال برقرار شد</span>
          </>
        ) : (
          <>
            <WifiOff className="w-5 h-5" />
            <span className="text-sm font-medium">
              اتصال اینترنت قطع شده است. لطفا اتصال خود را بررسی کنید.
            </span>
          </>
        )}
      </div>
    </div>
  );
}
