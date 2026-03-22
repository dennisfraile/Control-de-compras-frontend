import { Info } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DependencyBannerProps {
  show: boolean;
  message: string;
  actionLabel: string;
  actionPath: string;
}

export default function DependencyBanner({
  show,
  message,
  actionLabel,
  actionPath,
}: DependencyBannerProps) {
  if (!show) return null;

  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-4 animate-fade-in">
      <div className="flex items-start gap-3">
        <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            {message}
          </p>
          <Link
            to={actionPath}
            className="inline-flex items-center gap-1 mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            {actionLabel} &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
