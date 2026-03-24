import { useState } from 'react';
import { Settings, Eye, EyeOff, RotateCcw, GripVertical, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboardStore, type WidgetId } from '../../stores/dashboard.store';

const WIDGET_LABELS: Record<WidgetId, string> = {
  stats: 'Tarjetas de resumen',
  lowStock: 'Alerta de stock bajo',
  chart: 'Grafica de gastos',
  quickConsume: 'Consumo rapido',
  savingsGoal: 'Meta de ahorro',
  recentPurchases: 'Compras recientes',
};

export default function DashboardCustomizer() {
  const [open, setOpen] = useState(false);
  const { widgetOrder, hiddenWidgets, toggleWidget, resetLayout } = useDashboardStore();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Personalizar dashboard"
      >
        <Settings size={18} className="text-gray-500 dark:text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed right-0 top-0 h-full w-80 bg-white dark:bg-gray-800 shadow-2xl z-50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  Personalizar dashboard
                </h3>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                >
                  <X size={18} className="text-gray-500" />
                </button>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Muestra u oculta los widgets del dashboard
              </p>

              <div className="space-y-2">
                {widgetOrder.map((widgetId) => {
                  const isHidden = hiddenWidgets.includes(widgetId);
                  return (
                    <div
                      key={widgetId}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
                        isHidden
                          ? 'border-gray-200 dark:border-gray-700 opacity-60'
                          : 'border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/10'
                      }`}
                    >
                      <GripVertical size={16} className="text-gray-400 cursor-grab" />
                      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">
                        {WIDGET_LABELS[widgetId]}
                      </span>
                      <button
                        onClick={() => toggleWidget(widgetId)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      >
                        {isHidden ? (
                          <EyeOff size={16} className="text-gray-400" />
                        ) : (
                          <Eye size={16} className="text-blue-500" />
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={resetLayout}
                className="mt-6 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
              >
                <RotateCcw size={14} />
                Restablecer por defecto
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
