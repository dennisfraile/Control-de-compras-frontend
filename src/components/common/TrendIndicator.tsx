import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface TrendIndicatorProps {
  current: number;
  previous: number;
  label?: string;
  invertColors?: boolean; // true = down is good (spending less)
}

export default function TrendIndicator({ current, previous, label, invertColors = false }: TrendIndicatorProps) {
  if (!previous || previous === 0) return null;

  const change = ((current - previous) / previous) * 100;
  const isUp = change > 0;
  const isNeutral = Math.abs(change) < 1;

  const isPositive = invertColors ? !isUp : isUp;

  if (isNeutral) {
    return (
      <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
        <Minus size={14} />
        <span className="text-xs font-medium">Sin cambios</span>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-1 ${
        isPositive
          ? 'text-green-600 dark:text-green-400'
          : 'text-red-600 dark:text-red-400'
      }`}
    >
      {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
      <span className="text-xs font-medium">
        {Math.abs(change).toFixed(1)}%
        {label && ` ${label}`}
      </span>
    </div>
  );
}
