import { useState, useMemo } from 'react';
import { ArrowRight, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { formatCurrency } from '../../utils/format';

interface ComparatorProduct {
  productId: string;
  productName: string;
  prices: Record<string, number>; // storeId -> price
}

interface StoreComparatorProps {
  stores: Array<{ id: string; name: string }>;
  purchases: Array<{
    storeId: string;
    items: Array<{
      productId: string;
      productName: string;
      unitPrice: number;
    }>;
  }>;
}

export default function StoreComparator({ stores, purchases }: StoreComparatorProps) {
  const [selectedStores, setSelectedStores] = useState<string[]>([]);

  const toggleStore = (id: string) => {
    setSelectedStores((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id);
      if (prev.length >= 3) return prev;
      return [...prev, id];
    });
  };

  const comparison = useMemo(() => {
    if (selectedStores.length < 2) return [];

    const productMap = new Map<string, ComparatorProduct>();

    purchases.forEach((p) => {
      if (!selectedStores.includes(p.storeId)) return;
      p.items?.forEach((item) => {
        if (!productMap.has(item.productId)) {
          productMap.set(item.productId, {
            productId: item.productId,
            productName: item.productName,
            prices: {},
          });
        }
        const existing = productMap.get(item.productId)!;
        // Keep the latest price per store
        existing.prices[p.storeId] = item.unitPrice;
      });
    });

    // Only include products that exist in at least 2 selected stores
    return Array.from(productMap.values()).filter(
      (p) => Object.keys(p.prices).filter((s) => selectedStores.includes(s)).length >= 2
    );
  }, [selectedStores, purchases]);

  const storeNames = useMemo(() => {
    const map: Record<string, string> = {};
    stores.forEach((s) => (map[s.id] = s.name));
    return map;
  }, [stores]);

  return (
    <div className="space-y-4">
      {/* Store selector */}
      <div>
        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Selecciona 2-3 tiendas para comparar
        </p>
        <div className="flex flex-wrap gap-2">
          {stores.map((store) => (
            <button
              key={store.id}
              onClick={() => toggleStore(store.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedStores.includes(store.id)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {store.name}
            </button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      {selectedStores.length >= 2 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-gray-700">
          {comparison.length === 0 ? (
            <div className="p-8 text-center text-gray-500 dark:text-gray-400 text-sm">
              No hay productos en comun entre las tiendas seleccionadas
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-900/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Producto
                    </th>
                    {selectedStores.map((sId) => (
                      <th
                        key={sId}
                        className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400"
                      >
                        {storeNames[sId] || sId}
                      </th>
                    ))}
                    <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                      Mejor precio
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((product) => {
                    const prices = selectedStores
                      .filter((s) => product.prices[s] != null)
                      .map((s) => ({ storeId: s, price: product.prices[s] }));
                    const minPrice = Math.min(...prices.map((p) => p.price));
                    const bestStore = prices.find((p) => p.price === minPrice);

                    return (
                      <tr
                        key={product.productId}
                        className="border-t border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">
                          {product.productName}
                        </td>
                        {selectedStores.map((sId) => {
                          const price = product.prices[sId];
                          const isBest = price === minPrice;
                          return (
                            <td key={sId} className="px-4 py-3 text-center text-sm">
                              {price != null ? (
                                <span
                                  className={
                                    isBest
                                      ? 'font-bold text-green-600 dark:text-green-400'
                                      : 'text-gray-700 dark:text-gray-300'
                                  }
                                >
                                  {formatCurrency(price)}
                                </span>
                              ) : (
                                <span className="text-gray-400">-</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3 text-center">
                          {bestStore && (
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                              <TrendingDown size={12} />
                              {storeNames[bestStore.storeId]}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
