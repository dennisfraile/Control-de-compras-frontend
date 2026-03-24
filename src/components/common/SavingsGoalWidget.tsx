import { useMemo } from 'react';
import { Target, TrendingDown, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface SavingsGoalWidgetProps {
  currentMonthSpent: number;
  previousMonthSpent: number;
  budgetAmount?: number;
}

export default function SavingsGoalWidget({
  currentMonthSpent,
  previousMonthSpent,
  budgetAmount,
}: SavingsGoalWidgetProps) {
  const stats = useMemo(() => {
    const target = budgetAmount || previousMonthSpent * 0.9; // Default: 10% less than last month
    const saved = target - currentMonthSpent;
    const progress = target > 0 ? Math.min((currentMonthSpent / target) * 100, 100) : 0;
    const onTrack = currentMonthSpent <= target;
    const vsLastMonth = previousMonthSpent > 0
      ? ((previousMonthSpent - currentMonthSpent) / previousMonthSpent) * 100
      : 0;

    return { target, saved, progress, onTrack, vsLastMonth };
  }, [currentMonthSpent, previousMonthSpent, budgetAmount]);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Meta de ahorro
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {stats.onTrack ? 'Vas bien este mes' : 'Cuidado con el gasto'}
          </p>
        </div>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          stats.onTrack ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
        }`}>
          <Target size={20} className={stats.onTrack ? 'text-green-600' : 'text-red-600'} />
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
          <span>Gastado: {formatCurrency(currentMonthSpent)}</span>
          <span>Meta: {formatCurrency(stats.target)}</span>
        </div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              stats.progress > 90
                ? 'bg-red-500'
                : stats.progress > 70
                ? 'bg-amber-500'
                : 'bg-green-500'
            }`}
            style={{ width: `${stats.progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">Restante</p>
          <p className={`text-lg font-bold ${
            stats.saved >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}>
            {stats.saved >= 0 ? formatCurrency(stats.saved) : `-${formatCurrency(Math.abs(stats.saved))}`}
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
          <p className="text-xs text-gray-500 dark:text-gray-400">vs mes anterior</p>
          <div className="flex items-center gap-1 mt-1">
            {stats.vsLastMonth > 0 ? (
              <>
                <TrendingDown size={16} className="text-green-600 dark:text-green-400" />
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {stats.vsLastMonth.toFixed(1)}%
                </span>
              </>
            ) : (
              <>
                <TrendingUp size={16} className="text-red-600 dark:text-red-400" />
                <span className="text-lg font-bold text-red-600 dark:text-red-400">
                  {Math.abs(stats.vsLastMonth).toFixed(1)}%
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
