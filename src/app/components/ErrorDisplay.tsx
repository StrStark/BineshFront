import { AlertCircle, RefreshCw, X } from 'lucide-react';
import { useCurrentColors } from '../contexts/ThemeColorsContext';

interface ErrorDisplayProps {
  error: {
    message: string;
    code?: number;
    details?: string;
  };
  onRetry?: () => void;
  onDismiss?: () => void;
  compact?: boolean;
}

/**
 * Reusable error display component for showing API errors
 * Can be used inline in any component to show errors without crashing
 */
export function ErrorDisplay({ error, onRetry, onDismiss, compact = false }: ErrorDisplayProps) {
  const colors = useCurrentColors();

  if (compact) {
    return (
      <div
        className="flex items-center gap-3 p-3 rounded-lg border"
        style={{
          backgroundColor: colors.surface,
          borderColor: '#e92c2c20',
          color: colors.text,
        }}
      >
        <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
        <span className="text-sm flex-1">{error.message}</span>
        <div className="flex items-center gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="تلاش مجدد"
            >
              <RefreshCw className="w-4 h-4" style={{ color: colors.primary }} />
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="بستن"
            >
              <X className="w-4 h-4" style={{ color: colors.textSecondary }} />
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="p-6 rounded-lg border"
      style={{
        backgroundColor: colors.surface,
        borderColor: '#e92c2c20',
      }}
    >
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-500" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="font-semibold mb-2" style={{ color: colors.text }}>
            خطا در دریافت اطلاعات
          </h3>
          <p className="text-sm mb-3" style={{ color: colors.textSecondary }}>
            {error.message}
          </p>
          
          {error.code && (
            <p className="text-xs mb-2" style={{ color: colors.textSecondary }}>
              کد خطا: {error.code}
            </p>
          )}
          
          {error.details && (
            <details className="text-xs mt-2">
              <summary
                className="cursor-pointer hover:underline"
                style={{ color: colors.textSecondary }}
              >
                جزئیات بیشتر
              </summary>
              <pre
                className="mt-2 p-2 rounded bg-gray-100 dark:bg-gray-800 overflow-auto"
                style={{ color: colors.textSecondary }}
              >
                {error.details}
              </pre>
            </details>
          )}

          <div className="flex items-center gap-3 mt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                className="flex items-center gap-2 px-4 py-3 rounded-lg transition-colors"
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                }}
              >
                <RefreshCw className="w-5 h-5" />
                تلاش مجدد
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                className="px-4 py-3 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                style={{ color: colors.textSecondary }}
              >
                بستن
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
