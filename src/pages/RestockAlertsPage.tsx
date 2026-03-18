import { useQuery } from '@tanstack/react-query';
import { Bell, AlertTriangle, AlertCircle, Info } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import { getRestockAlerts } from '../api/inventory.api';

interface RestockAlert {
  id: string;
  productName: string;
  currentStock: number;
  unit: string;
  estimatedDaysRemaining: number;
  dailyConsumptionRate: number;
  recommendedQuantity: number;
  urgency: 'Critical' | 'Warning' | 'Info';
}

const urgencyConfig = {
  Critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    border: 'border-red-200 dark:border-red-800',
    icon: AlertTriangle,
    iconColor: 'text-red-500 dark:text-red-400',
    badge: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400',
    label: 'Critico',
  },
  Warning: {
    bg: 'bg-yellow-50 dark:bg-yellow-900/20',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: AlertCircle,
    iconColor: 'text-yellow-500 dark:text-yellow-400',
    badge: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400',
    label: 'Advertencia',
  },
  Info: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-200 dark:border-blue-800',
    icon: Info,
    iconColor: 'text-blue-500 dark:text-blue-400',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
    label: 'Informativo',
  },
};

export default function RestockAlertsPage() {
  const { data, isLoading } = useQuery<RestockAlert[]>({
    queryKey: ['restock-alerts'],
    queryFn: getRestockAlerts,
  });

  const alerts = data ?? [];

  const groupedAlerts = {
    Critical: alerts.filter((a) => a.urgency === 'Critical'),
    Warning: alerts.filter((a) => a.urgency === 'Warning'),
    Info: alerts.filter((a) => a.urgency === 'Info'),
  };

  return (
    <div>
      <PageHeader
        title="Alertas de Reabastecimiento"
        subtitle="Productos que necesitas comprar pronto"
      />

      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-pulse">
              <div className="bg-gray-200 dark:bg-gray-700 h-6 w-1/3 rounded mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[...Array(2)].map((_, j) => (
                  <div key={j} className="bg-gray-200 dark:bg-gray-700 h-28 rounded-lg" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center animate-fade-in">
          <Bell className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No hay alertas de reabastecimiento
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
            Tu inventario esta en buen estado
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(['Critical', 'Warning', 'Info'] as const).map((urgency) => {
            const items = groupedAlerts[urgency];
            if (items.length === 0) return null;

            const config = urgencyConfig[urgency];
            const UrgencyIcon = config.icon;

            return (
              <div key={urgency} className="animate-fade-in">
                <div className="flex items-center gap-2 mb-3">
                  <UrgencyIcon className={`w-5 h-5 ${config.iconColor}`} />
                  <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                    {config.label}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${config.badge}`}>
                    {items.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((alert) => (
                    <div
                      key={alert.id}
                      className={`${config.bg} ${config.border} border rounded-xl p-4`}
                    >
                      <h3 className="font-bold text-gray-800 dark:text-white mb-2">
                        {alert.productName}
                      </h3>
                      <div className="space-y-1.5 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Stock actual:</span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {alert.currentStock} {alert.unit}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Dias restantes:</span>
                          <span className={`font-medium ${alert.estimatedDaysRemaining <= 3 ? 'text-red-500' : 'text-gray-800 dark:text-white'}`}>
                            ~{alert.estimatedDaysRemaining} dias
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Consumo diario:</span>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {alert.dailyConsumptionRate.toFixed(1)} {alert.unit}/dia
                          </span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-gray-200 dark:border-gray-600">
                          <span className="text-gray-500 dark:text-gray-400">Comprar:</span>
                          <span className="font-bold text-blue-600 dark:text-blue-400">
                            {alert.recommendedQuantity} {alert.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
