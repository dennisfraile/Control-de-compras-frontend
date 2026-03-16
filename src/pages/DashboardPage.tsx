import {
  DollarSign,
  AlertTriangle,
  ShoppingCart,
  Package,
  TrendingUp,
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
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useLowStock } from '../hooks/useInventory';
import { usePurchaseSummary } from '../hooks/usePurchases';
import { useShoppingList } from '../hooks/useShoppingList';
import { formatCurrency } from '../utils/format';
import { useThemeContext } from '../context/ThemeContext';

interface StatCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  loading?: boolean;
}

function StatCard({ title, subtitle, value, icon, iconBg, valueColor, loading }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 card-hover animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          {loading ? (
            <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-8 w-20 rounded mb-2" />
          ) : (
            <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            {title}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${iconBg}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { theme } = useThemeContext();
  const { data: lowStockItems, isLoading: lowStockLoading } = useLowStock();
  const { data: summary, isLoading: summaryLoading } = usePurchaseSummary();
  const { data: shoppingList, isLoading: shoppingLoading } = useShoppingList();

  const pendingItems = shoppingList?.filter((item) => !item.isChecked).length ?? 0;

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de tu control de compras"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-6">
        <StatCard
          title="Gasto del Mes"
          subtitle="Total gastado este mes"
          value={summary ? formatCurrency(summary.totalSpent) : '$0'}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          iconBg="bg-green-500"
          valueColor="text-green-500"
          loading={summaryLoading}
        />
        <StatCard
          title="Stock Bajo"
          subtitle="Productos por acabarse"
          value={lowStockItems?.length ?? 0}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          iconBg="bg-red-500"
          valueColor="text-red-500"
          loading={lowStockLoading}
        />
        <StatCard
          title="Lista de Compras"
          subtitle="Items pendientes"
          value={pendingItems}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          iconBg="bg-blue-500"
          valueColor="text-blue-500"
          loading={shoppingLoading}
        />
        <StatCard
          title="Inventario"
          subtitle="Total de productos"
          value={lowStockItems ? '...' : 0}
          icon={<Package className="w-6 h-6 text-white" />}
          iconBg="bg-purple-500"
          valueColor="text-purple-500"
          loading={lowStockLoading}
        />
        <StatCard
          title="Mes Anterior"
          subtitle="Variacion vs mes pasado"
          value="--"
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBg="bg-amber-500"
          valueColor="text-amber-500"
          loading={summaryLoading}
        />
      </div>

      {lowStockItems && lowStockItems.length > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6 animate-fade-in">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
                Productos con stock bajo
              </p>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                {lowStockItems.slice(0, 5).map((item) => item.product?.name ?? 'Producto desconocido').join(', ')}
                {lowStockItems.length > 5 && ` y ${lowStockItems.length - 5} mas...`}
                {' '}
                <Link to="/inventory" className="font-bold underline">
                  Ver inventario
                </Link>
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Gasto mensual
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Historial de gastos totales por mes
        </p>
        {summaryLoading ? (
          <div className="animate-pulse bg-gray-200 dark:bg-gray-700 h-72 rounded-lg" />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={summary?.monthlySpending ?? []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
              />
              <XAxis
                dataKey="month"
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <YAxis
                tick={{ fill: theme === 'dark' ? '#9ca3af' : '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label: string) => `Mes: ${label}`}
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
    </div>
  );
}
