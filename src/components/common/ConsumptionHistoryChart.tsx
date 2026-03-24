import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import { reportsApi, type ConsumptionHistory } from '../../api/reports.api';
import { useThemeContext } from '../../context/ThemeContext';
import { formatCurrency } from '../../utils/format';

interface ConsumptionHistoryChartProps {
  productId: string;
  productName: string;
  onClose: () => void;
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        {payload[0].value.toFixed(1)} unidades
      </p>
      {payload[0]?.payload?.totalSpent != null && (
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {formatCurrency(payload[0].payload.totalSpent)}
        </p>
      )}
    </div>
  );
}

export default function ConsumptionHistoryChart({
  productId,
  productName,
  onClose,
}: ConsumptionHistoryChartProps) {
  const { theme } = useThemeContext();
  const [view, setView] = useState<'weekly' | 'monthly'>('monthly');

  const { data, isLoading } = useQuery({
    queryKey: ['consumption-history', productId],
    queryFn: () => reportsApi.getConsumptionHistory(productId),
    enabled: !!productId,
  });

  const chartData = view === 'weekly' ? data?.weeklyConsumption : data?.monthlyConsumption;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Historial de consumo
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">{productName}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5">
            <button
              onClick={() => setView('weekly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === 'weekly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Semanal
            </button>
            <button
              onClick={() => setView('monthly')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                view === 'monthly'
                  ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              Mensual
            </button>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-400"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Stats */}
      {data && (
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Promedio semanal</p>
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {data.averageWeeklyConsumption.toFixed(1)}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3">
            <p className="text-xs text-gray-500 dark:text-gray-400">Promedio mensual</p>
            <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
              {data.averageMonthlyConsumption.toFixed(1)}
            </p>
          </div>
        </div>
      )}

      {/* Chart */}
      {isLoading ? (
        <div className="h-48 bg-gray-100 dark:bg-gray-700 rounded-lg animate-pulse" />
      ) : chartData && chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorQty" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
            />
            <XAxis
              dataKey="period"
              tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 10 }}
            />
            <YAxis
              tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="quantity"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorQty)"
              animationDuration={600}
            />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-48 flex items-center justify-center text-gray-400 text-sm">
          No hay datos de consumo disponibles
        </div>
      )}
    </div>
  );
}
