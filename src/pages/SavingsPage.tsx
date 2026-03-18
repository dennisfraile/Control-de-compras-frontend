import { useQuery } from '@tanstack/react-query';
import {
  TrendingDown,
  TrendingUp,
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import PageHeader from '../components/common/PageHeader';
import { getSavingsAnalysis } from '../api/savings.api';
import { formatCurrency } from '../utils/format';
import { useThemeContext } from '../context/ThemeContext';

interface SavingsData {
  totalSpentThisMonth: number;
  totalSpentLastMonth: number;
  monthOverMonthChange: number;
  spendingByStore: { store: string; total: number }[];
  topSavings: {
    productName: string;
    cheapestStore: string;
    cheapestPrice: number;
    mostExpensiveStore: string;
    mostExpensivePrice: number;
    savings: number;
  }[];
}

export default function SavingsPage() {
  const { theme } = useThemeContext();
  const { data, isLoading } = useQuery<SavingsData>({
    queryKey: ['savings'],
    queryFn: getSavingsAnalysis,
  });

  const changeIsNegative = (data?.monthOverMonthChange ?? 0) < 0;

  return (
    <div>
      <PageHeader
        title="Analisis de Ahorro"
        subtitle="Compara tus gastos y encuentra donde ahorrar"
      />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gasto este mes</p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-28 rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {formatCurrency(data?.totalSpentThisMonth ?? 0)}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Gasto mes anterior</p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-28 rounded mt-1" />
              ) : (
                <p className="text-2xl font-bold text-gray-800 dark:text-white mt-1">
                  {formatCurrency(data?.totalSpentLastMonth ?? 0)}
                </p>
              )}
            </div>
            <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Variacion mensual</p>
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-28 rounded mt-1" />
              ) : (
                <p className={`text-2xl font-bold mt-1 flex items-center gap-1 ${changeIsNegative ? 'text-green-500' : 'text-red-500'}`}>
                  {changeIsNegative ? (
                    <ArrowDownRight className="w-6 h-6" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6" />
                  )}
                  {Math.abs(data?.monthOverMonthChange ?? 0).toFixed(1)}%
                </p>
              )}
            </div>
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${changeIsNegative ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
              {changeIsNegative ? (
                <TrendingDown className={`w-6 h-6 ${changeIsNegative ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`} />
              ) : (
                <TrendingUp className="w-6 h-6 text-red-600 dark:text-red-400" />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spending by Store Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 animate-fade-in">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
          Gasto por tienda
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Comparacion de gasto total en cada tienda
        </p>
        {isLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-72 rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={data?.spendingByStore ?? []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="store"
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                contentStyle={{
                  backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                  border: `1px solid ${theme === 'dark' ? '#374151' : '#e5e7eb'}`,
                  borderRadius: 8,
                  color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                }}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Top Savings Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-1">
          Mayores diferencias de precio
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Productos donde puedes ahorrar comprando en otra tienda
        </p>
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 h-12 rounded" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Producto</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Tienda mas barata</th>
                  <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Precio bajo</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Tienda mas cara</th>
                  <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Precio alto</th>
                  <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Ahorro</th>
                </tr>
              </thead>
              <tbody>
                {(data?.topSavings ?? []).map((item, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-2 font-medium text-gray-800 dark:text-white">{item.productName}</td>
                    <td className="py-3 px-2 text-green-600 dark:text-green-400">{item.cheapestStore}</td>
                    <td className="py-3 px-2 text-right text-green-600 dark:text-green-400">{formatCurrency(item.cheapestPrice)}</td>
                    <td className="py-3 px-2 text-red-500 dark:text-red-400">{item.mostExpensiveStore}</td>
                    <td className="py-3 px-2 text-right text-red-500 dark:text-red-400">{formatCurrency(item.mostExpensivePrice)}</td>
                    <td className="py-3 px-2 text-right font-bold text-green-600 dark:text-green-400">{formatCurrency(item.savings)}</td>
                  </tr>
                ))}
                {(data?.topSavings ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                      No hay datos de ahorro disponibles aun
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
