import { Plus } from 'lucide-react';
import { ReactNode } from 'react';
import HelpTooltip from '../HelpTooltip';
import { sectionHelp } from '../../utils/helpContent';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  helpKey?: string;
  actionLabel?: string;
  actionIcon?: ReactNode;
  onAction?: () => void;
  children?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  helpKey,
  actionLabel,
  actionIcon,
  onAction,
  children,
}: PageHeaderProps) {
  const helpContent = helpKey ? sectionHelp[helpKey] : undefined;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
          {title}
          {helpContent && <HelpTooltip content={helpContent} />}
        </h1>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subtitle}
          </p>
        )}
      </div>
      <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
        {children}
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors w-full sm:w-auto min-h-[44px]"
          >
            {actionIcon || <Plus className="w-4 h-4" />}
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}
