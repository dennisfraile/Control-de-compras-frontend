import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ShoppingBag, Store, Tag, Calculator } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { getConsumptionStats } from '../api/statistics.api';

interface StatData {
  mostBoughtProduct: string;
  mostVisitedStore: string;
  topSpendingCategory: string;
  averagePerPurchase: number;
  monthlyTrend: { month: string; total: number }[];
  spendingByCategory: { category: string; total: number }[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#6366f1',
];

function HighlightCard({ icon: Icon, label, value }: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
          <Icon size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="min-w-0">
          <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">{label}</p>
          <p className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={value}>
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function StatisticsPage() {
  const { data: stats, isLoading } = useQuery<StatData>({
    queryKey: ['statistics'],
    queryFn: getConsumptionStats,
  });

  if (isLoading) return <LoadingSpinner />;

  if (!stats) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageHeader title="Estadisticas de consumo" subtitle="No hay datos disponibles aun" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Estadisticas de consumo"
          subtitle="Resumen de tus habitos de compra"
        />

        {/* Highlight cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <HighlightCard
            icon={ShoppingBag}
            label="Producto mas comprado"
            value={stats.mostBoughtProduct || '-'}
          />
          <HighlightCard
            icon={Store}
            label="Tienda mas visitada"
            value={stats.mostVisitedStore || '-'}
          />
          <HighlightCard
            icon={Tag}
            label="Categoria con mas gasto"
            value={stats.topSpendingCategory || '-'}
          />
          <HighlightCard
            icon={Calculator}
            label="Promedio por compra"
            value={stats.averagePerPurchase != null ? `$${stats.averagePerPurchase.toLocaleString()}` : '-'}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly trend */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Tendencia de gasto mensual
            </h2>
            {stats.monthlyTrend && stats.monthlyTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-gray-600 dark:text-gray-400" />
                  <YAxis tick={{ fontSize: 12 }} className="text-gray-600 dark:text-gray-400" />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg, #fff)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">Sin datos disponibles</p>
            )}
          </div>

          {/* Spending by category */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              Gasto por categoria
            </h2>
            {stats.spendingByCategory && stats.spendingByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={stats.spendingByCategory} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="category" type="category" tick={{ fontSize: 12 }} width={100} />
                  <Tooltip
                    formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total']}
                    contentStyle={{
                      backgroundColor: 'var(--tooltip-bg, #fff)',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Bar dataKey="total" radius={[0, 4, 4, 0]}>
                    {stats.spendingByCategory.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-12">Sin datos disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
