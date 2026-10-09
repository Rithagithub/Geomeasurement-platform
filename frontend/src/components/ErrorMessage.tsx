import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onDismiss?: () => void;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Processing Error',
  message,
  onDismiss,
  onRetry,
}) => {
  return (
    <div className="rounded-xl border border-rose-200 bg-rose-50/80 p-4 shadow-sm text-slate-800 transition-all">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-rose-600 mt-0.5" />
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
          <div className="mt-1 text-sm text-rose-700 font-normal leading-relaxed">{message}</div>
          {onRetry && (
            <div className="mt-3">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex rounded-md p-1.5 text-rose-500 hover:bg-rose-100 hover:text-rose-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
