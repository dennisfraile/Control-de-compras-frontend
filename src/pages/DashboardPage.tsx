import { useMemo } from 'react';
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
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import OnboardingChecklist from '../components/onboarding/OnboardingChecklist';
import TrendIndicator from '../components/common/TrendIndicator';
import DashboardCustomizer from '../components/common/DashboardCustomizer';
import SavingsGoalWidget from '../components/common/SavingsGoalWidget';
import QuickConsumeWidget from '../components/common/QuickConsumeWidget';
import { useLowStock, useInventory } from '../hooks/useInventory';
import { usePurchaseSummary, usePurchases } from '../hooks/usePurchases';
import { useShoppingList } from '../hooks/useShoppingList';
import { useDashboardStore } from '../stores/dashboard.store';
import { formatCurrency, formatDate } from '../utils/format';
import { useThemeContext } from '../context/ThemeContext';
import { DashboardSkeleton } from '../components/Skeleton';

// ---- Custom tooltip for Recharts (#12) ----
function CustomChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-3">
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">{label}</p>
      <p className="text-sm font-bold text-gray-900 dark:text-white">
        {formatCurrency(payload[0].value)}
      </p>
    </div>
  );
}

// ---- Stat card with trend indicator (#14) ----
interface StatCardProps {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  loading?: boolean;
  trend?: { current: number; previous: number; invertColors?: boolean };
}

function StatCard({ title, subtitle, value, icon, iconBg, valueColor, loading, trend }: StatCardProps) {
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
          {trend && !loading && (
            <div className="mt-1.5">
              <TrendIndicator
                current={trend.current}
                previous={trend.previous}
                invertColors={trend.invertColors}
              />
            </div>
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

// ---- Bar colors for chart (#12) ----
const BAR_COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#3b82f6', '#2563eb', '#1d4ed8'];
function getBarColor(index: number, total: number) {
  if (index === total - 1) return '#3b82f6'; // current month highlighted
  return '#93c5fd';
}

export default function DashboardPage() {
  const { theme } = useThemeContext();
  const { data: lowStockItems, isLoading: lowStockLoading } = useLowStock();
  const { data: summary, isLoading: summaryLoading } = usePurchaseSummary();
  const { data: shoppingList, isLoading: shoppingLoading } = useShoppingList();
  const { data: inventory } = useInventory();
  const { data: purchases } = usePurchases();
  const { widgetOrder, hiddenWidgets } = useDashboardStore();

  const pendingItems = shoppingList?.filter((item: any) => !item.isChecked).length ?? 0;
  const isLoading = lowStockLoading || summaryLoading || shoppingLoading;

  // Compute monthly trend (#14)
  const monthlyTrend = useMemo(() => {
    if (!summary?.monthlySpending || summary.monthlySpending.length < 2) return null;
    const sorted = [...summary.monthlySpending].sort((a, b) => a.month.localeCompare(b.month));
    const current = sorted[sorted.length - 1]?.total ?? 0;
    const previous = sorted[sorted.length - 2]?.total ?? 0;
    return { current, previous };
  }, [summary]);

  // Recent purchases for widget
  const recentPurchases = useMemo(() => {
    if (!purchases) return [];
    return [...purchases]
      .sort((a, b) => new Date(b.purchaseDateUtc).getTime() - new Date(a.purchaseDateUtc).getTime())
      .slice(0, 5);
  }, [purchases]);

  const isWidgetVisible = (id: string) => !hiddenWidgets.includes(id as any);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <DashboardSkeleton />
        </div>
      </div>
    );
  }

  // Widget renderers (#13 - customizable dashboard)
  const widgets: Record<string, React.ReactNode> = {
    stats: (
      <div key="stats" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <StatCard
          title="Gasto del mes"
          subtitle="Total gastado este mes"
          value={summary ? formatCurrency(summary.totalSpent) : '$0'}
          icon={<DollarSign className="w-6 h-6 text-white" />}
          iconBg="bg-green-500"
          valueColor="text-green-500"
          loading={summaryLoading}
          trend={monthlyTrend ? { current: monthlyTrend.current, previous: monthlyTrend.previous, invertColors: true } : undefined}
        />
        <StatCard
          title="Stock bajo"
          subtitle="Productos por acabarse"
          value={lowStockItems?.length ?? 0}
          icon={<AlertTriangle className="w-6 h-6 text-white" />}
          iconBg="bg-red-500"
          valueColor="text-red-500"
          loading={lowStockLoading}
        />
        <StatCard
          title="Lista de compras"
          subtitle="Items pendientes"
          value={pendingItems}
          icon={<ShoppingCart className="w-6 h-6 text-white" />}
          iconBg="bg-blue-500"
          valueColor="text-blue-500"
          loading={shoppingLoading}
        />
        <StatCard
          title="Inventario"
          subtitle="Productos registrados"
          value={inventory?.length ?? 0}
          icon={<Package className="w-6 h-6 text-white" />}
          iconBg="bg-purple-500"
          valueColor="text-purple-500"
        />
        <StatCard
          title="Mes anterior"
          subtitle="Variacion vs mes pasado"
          value={monthlyTrend ? formatCurrency(monthlyTrend.previous) : '--'}
          icon={<TrendingUp className="w-6 h-6 text-white" />}
          iconBg="bg-amber-500"
          valueColor="text-amber-500"
          loading={summaryLoading}
        />
      </div>
    ),

    lowStock: lowStockItems && lowStockItems.length > 0 ? (
      <div key="lowStock" className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 animate-fade-in">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-800 dark:text-amber-200 text-sm">
              Productos con stock bajo
            </p>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              {lowStockItems.slice(0, 5).map((item: any) => item.product?.name ?? item.productName ?? 'Producto').join(', ')}
              {lowStockItems.length > 5 && ` y ${lowStockItems.length - 5} mas...`}
              {' '}
              <Link to="/inventory" className="font-bold underline">
                Ver inventario
              </Link>
            </p>
          </div>
        </div>
      </div>
    ) : null,

    chart: (
      <div key="chart" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
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
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
              />
              <RechartsTooltip content={<CustomChartTooltip />} cursor={{ fill: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }} />
              <Bar dataKey="total" radius={[6, 6, 0, 0]} animationDuration={800}>
                {(summary?.monthlySpending ?? []).map((_, index) => (
                  <Cell
                    key={index}
                    fill={getBarColor(index, summary?.monthlySpending?.length ?? 0)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    ),

    quickConsume: inventory && inventory.length > 0 ? (
      <QuickConsumeWidget key="quickConsume" items={inventory} />
    ) : null,

    savingsGoal: (
      <SavingsGoalWidget
        key="savingsGoal"
        currentMonthSpent={monthlyTrend?.current ?? 0}
        previousMonthSpent={monthlyTrend?.previous ?? 0}
      />
    ),

    recentPurchases: recentPurchases.length > 0 ? (
      <div key="recentPurchases" className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">
          Compras recientes
        </h3>
        <div className="space-y-2">
          {recentPurchases.map((p) => (
            <Link
              key={p.id}
              to={`/purchases/${p.id}/edit`}
              className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {p.storeName || 'N/A'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(p.purchaseDateUtc)} · {p.items?.length ?? 0} items
                </p>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {formatCurrency(p.totalAmount)}
              </span>
            </Link>
          ))}
        </div>
        <Link
          to="/purchases"
          className="block text-center text-sm text-blue-600 dark:text-blue-400 font-medium mt-3 hover:underline"
        >
          Ver todas las compras
        </Link>
      </div>
    ) : null,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-start justify-between">
          <PageHeader
            title="Dashboard"
            helpKey="dashboard"
            subtitle="Resumen de tu control de compras"
          />
          <DashboardCustomizer />
        </div>

        <OnboardingChecklist />

        <div className="space-y-6">
          {widgetOrder.map((widgetId) => {
            if (!isWidgetVisible(widgetId)) return null;
            return widgets[widgetId] ?? null;
          })}
        </div>
      </div>
    </div>
  );
}
