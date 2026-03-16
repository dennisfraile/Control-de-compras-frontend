import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
      <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
        <div className="text-blue-500">{icon}</div>
      </div>
      <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 max-w-sm">
        {description}
      </p>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="bg-blue-600 text-white rounded-lg px-6 py-2.5 hover:bg-blue-700 font-medium transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
