import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, TrendingUp, TrendingDown, Minus, DollarSign, Store, Calendar, Scale } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { getPriceDetail } from '../api/products.api';
import { formatCurrency, formatDate } from '../utils/format';
import { useThemeContext } from '../context/ThemeContext';

interface PriceDetailResponse {
  productName: string;
  productBrand?: string;
  categoryName: string;
  averagePrice: number;
  cheapestPrice: number;
  cheapestStore: string;
  mostExpensivePrice: number;
  mostExpensiveStore: string;
  trend: 'up' | 'down' | 'stable';
  priceHistory: Array<{ date: string; storeName: string; unitPrice: number; quantity: number }>;
  pricePerBaseUnit?: number | null;
  baseUnitLabel?: string | null;
}

const STORE_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

export default function ProductPriceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme } = useThemeContext();

  const { data, isLoading, isError } = useQuery<PriceDetailResponse>({
    queryKey: ['priceDetail', id],
    queryFn: () => getPriceDetail(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-red-600 dark:text-red-400">Error al cargar los datos de precios.</div>
        </div>
      </div>
    );
  }

  // Build chart data: pivot so each row is a date with store columns
  const storeNames = [...new Set(data.priceHistory.map((h) => h.storeName))];
  const chartDataMap = new Map<string, Record<string, number | string>>();

  for (const entry of data.priceHistory) {
    const key = entry.date;
    if (!chartDataMap.has(key)) {
      chartDataMap.set(key, { date: formatDate(entry.date, 'DD/MM/YY') });
    }
    chartDataMap.get(key)![entry.storeName] = entry.unitPrice;
  }

  const chartData = [...chartDataMap.values()];

  const TrendIcon = data.trend === 'up' ? TrendingUp : data.trend === 'down' ? TrendingDown : Minus;
  const trendColor = data.trend === 'up' ? 'text-red-500' : data.trend === 'down' ? 'text-green-500' : 'text-gray-500';
  const trendLabel = data.trend === 'up' ? 'Al alza' : data.trend === 'down' ? 'A la baja' : 'Estable';

  const axisColor = theme === 'dark' ? '#9ca3af' : '#6b7280';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back button + title */}
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} className="text-gray-600 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              Historial de precios: {data.productName}
            </h1>
            {data.productBrand && (
              <p className="text-sm text-gray-500 dark:text-gray-400">{data.productBrand} - {data.categoryName}</p>
            )}
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Promedio */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <DollarSign size={16} />
              <span>Precio promedio</span>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-white">{formatCurrency(data.averagePrice)}</p>
          </div>

          {/* Mas barato */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 mb-1">
              <Store size={16} />
              <span>Mas barato</span>
            </div>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(data.cheapestPrice)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.cheapestStore}</p>
          </div>

          {/* Mas caro */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-red-500">
            <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 mb-1">
              <Store size={16} />
              <span>Mas caro</span>
            </div>
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">{formatCurrency(data.mostExpensivePrice)}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{data.mostExpensiveStore}</p>
          </div>

          {/* Tendencia */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <TrendingUp size={16} />
              <span>Tendencia</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendIcon size={28} className={trendColor} />
              <span className={`text-2xl font-bold ${trendColor}`}>{trendLabel}</span>
            </div>
          </div>
        </div>

        {/* Comparable unit price */}
        {data.pricePerBaseUnit != null && data.baseUnitLabel && (
          <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-md p-6 mb-8 text-white">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                <Scale size={22} />
              </div>
              <div>
                <p className="text-sm text-indigo-100">Precio comparable</p>
                <p className="text-3xl font-bold tracking-tight">
                  {formatCurrency(data.pricePerBaseUnit)} <span className="text-base font-normal text-indigo-200">{data.baseUnitLabel}</span>
                </p>
              </div>
            </div>
            <p className="text-xs text-indigo-200 mt-2">
              Precio normalizado para comparar con otros productos de la misma categoria
            </p>
          </div>
        )}

        {/* Line chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Evolucion del precio</h2>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
                <XAxis dataKey="date" tick={{ fill: axisColor, fontSize: 12 }} />
                <YAxis tick={{ fill: axisColor, fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
                  }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Legend />
                {storeNames.map((store, idx) => (
                  <Line
                    key={store}
                    type="monotone"
                    dataKey={store}
                    stroke={STORE_COLORS[idx % STORE_COLORS.length]}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No hay datos suficientes para mostrar la grafica.</p>
          )}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Registros de compra</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Fecha</th>
                  <th className="text-left py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Tienda</th>
                  <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Cantidad</th>
                  <th className="text-right py-3 px-2 text-gray-500 dark:text-gray-400 font-medium">Precio unitario</th>
                </tr>
              </thead>
              <tbody>
                {data.priceHistory.map((entry, idx) => (
                  <tr key={idx} className="border-b border-gray-100 dark:border-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700/30">
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-gray-400" />
                        {formatDate(entry.date)}
                      </div>
                    </td>
                    <td className="py-3 px-2 text-gray-700 dark:text-gray-300">{entry.storeName}</td>
                    <td className="py-3 px-2 text-right text-gray-700 dark:text-gray-300">{entry.quantity}</td>
                    <td className="py-3 px-2 text-right font-medium text-gray-800 dark:text-white">{formatCurrency(entry.unitPrice)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {data.priceHistory.length === 0 && (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">No hay registros de compra.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
