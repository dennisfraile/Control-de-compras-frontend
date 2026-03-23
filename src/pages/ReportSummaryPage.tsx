import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Calendar, TrendingUp, TrendingDown, ShoppingCart, AlertTriangle, Clock } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { getReportSummary } from '../api/reports.api';
import { formatCurrency, formatDate } from '../utils/format';
import { useThemeContext } from '../context/ThemeContext';

interface SummaryResponse {
  totalSpent: number;
  purchaseCount: number;
  previousPeriodSpent: number;
  changePercent: number;
  topProducts: Array<{ productName: string; totalSpent: number }>;
  topStores: Array<{ storeName: string; totalSpent: number }>;
  lowStockItems: Array<{ productName: string; currentQuantity: number; unitAbbreviation: string }>;
  expiringItems: Array<{ productName: string; expirationDate: string; daysUntilExpiry: number }>;
}

const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function ReportSummaryPage() {
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const { theme } = useThemeContext();

  const { data, isLoading, isError } = useQuery<SummaryResponse>({
    queryKey: ['reportSummary', period],
    queryFn: () => getReportSummary(period),
  });

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader title="Reportes" helpKey="reports" />

        {/* Period toggle */}
        <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1 w-fit mb-6">
          <button
            onClick={() => setPeriod('week')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'week'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Esta semana
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              period === 'month'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white'
            }`}
          >
            Este mes
          </button>
        </div>

        {isLoading && <p className="text-gray-500 dark:text-gray-400">Cargando...</p>}
        {isError && <p className="text-red-500">Error al cargar el reporte.</p>}

        {data && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {/* Total gastado */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <Calendar size={16} />
                  <span>Total gastado</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(data.totalSpent)}</p>
              </div>

              {/* Compras */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  <ShoppingCart size={16} />
                  <span>Compras realizadas</span>
                </div>
                <p className="text-2xl font-bold text-gray-800 dark:text-white">{data.purchaseCount}</p>
              </div>

              {/* Variacion */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                  {data.changePercent > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                  <span>Variacion vs periodo anterior</span>
                </div>
                <div className="flex items-center gap-2">
                  {data.changePercent > 0 ? (
                    <TrendingUp size={24} className="text-red-500" />
                  ) : (
                    <TrendingDown size={24} className="text-green-500" />
                  )}
                  <span
                    className={`text-2xl font-bold ${
                      data.changePercent > 0 ? 'text-red-500' : 'text-green-500'
                    }`}
                  >
                    {data.changePercent > 0 ? '+' : ''}{data.changePercent.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Top products bar chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Top 5 productos por gasto</h2>
                {data.topProducts.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.topProducts} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                      <XAxis type="number" tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                      <YAxis
                        type="category"
                        dataKey="productName"
                        tick={{ fill: axisColor, fontSize: 12 }}
                        width={120}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Gasto']}
                      />
                      <Bar dataKey="totalSpent" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Sin datos disponibles.</p>
                )}
              </div>

              {/* Store pie chart */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Gasto por tienda</h2>
                {data.topStores.length > 0 ? (
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={data.topStores}
                        dataKey="totalSpent"
                        nameKey="storeName"
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label={({ storeName, percent }) =>
                          `${storeName} (${(percent * 100).toFixed(0)}%)`
                        }
                        labelLine
                      >
                        {data.topStores.map((_, idx) => (
                          <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                          border: 'none',
                          borderRadius: '0.5rem',
                          color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                        }}
                        formatter={(value: number) => [formatCurrency(value), 'Gasto']}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Sin datos disponibles.</p>
                )}
              </div>
            </div>

            {/* Lists row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Low stock */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-amber-500" />
                  Productos con stock bajo
                </h2>
                {data.lowStockItems.length > 0 ? (
                  <ul className="space-y-3">
                    {data.lowStockItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <AlertTriangle size={16} className="text-amber-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 flex-1">{item.productName}</span>
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          {item.currentQuantity} {item.unitAbbreviation}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Todo el inventario tiene stock suficiente.</p>
                )}
              </div>

              {/* Expiring soon */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Clock size={20} className="text-red-500" />
                  Proximos a vencer
                </h2>
                {data.expiringItems.length > 0 ? (
                  <ul className="space-y-3">
                    {data.expiringItems.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-3 text-sm">
                        <Clock size={16} className="text-red-500 shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 flex-1">{item.productName}</span>
                        <span
                          className={`font-medium ${
                            item.daysUntilExpiry <= 3
                              ? 'text-red-600 dark:text-red-400'
                              : 'text-amber-600 dark:text-amber-400'
                          }`}
                        >
                          {item.daysUntilExpiry <= 0
                            ? 'Vencido'
                            : item.daysUntilExpiry === 1
                              ? '1 dia'
                              : `${item.daysUntilExpiry} dias`}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">No hay productos proximos a vencer.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
