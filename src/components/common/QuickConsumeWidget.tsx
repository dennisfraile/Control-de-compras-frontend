import { useState } from 'react';
import { Minus, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSnackbar } from 'notistack';
import { inventoryApi } from '../../api/inventory.api';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../utils/constants';
import type { InventoryEntry } from '../../types/inventory.types';

interface QuickConsumeWidgetProps {
  items: InventoryEntry[];
}

export default function QuickConsumeWidget({ items }: QuickConsumeWidgetProps) {
  const [consuming, setConsuming] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const topItems = items
    .filter((item) => item.currentQuantity > 0)
    .slice(0, 8);

  const handleConsume = async (productId: string, productName: string) => {
    setConsuming(productId);
    try {
      await inventoryApi.quickConsume(productId, 1);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      enqueueSnackbar(`-1 ${productName}`, { variant: 'info', autoHideDuration: 1500 });
    } catch {
      enqueueSnackbar('Error al consumir', { variant: 'error' });
    } finally {
      setConsuming(null);
    }
  };

  if (topItems.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 animate-fade-in">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
        Consumo rapido
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Registra consumo con un toque
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {topItems.map((item) => (
          <motion.button
            key={item.productId}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleConsume(item.productId, item.productName || item.product?.name || '')}
            disabled={consuming === item.productId}
            className="flex items-center gap-2 p-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all text-left disabled:opacity-50"
          >
            <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center shrink-0">
              <Minus size={14} className="text-gray-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">
                {item.productName || item.product?.name || 'Producto'}
              </p>
              <p className="text-[10px] text-gray-400">
                {item.currentQuantity} {item.unitAbbreviation}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
