import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ShoppingCart, Check, DollarSign, Store as StoreIcon, ChevronRight } from 'lucide-react';
import { shoppingListApi } from '../api/shopping-list.api';
import { purchasesApi } from '../api/purchases.api';
import { storesApi } from '../api/stores.api';
import { formatCurrency } from '../utils/format';
import PageHeader from '../components/common/PageHeader';
import { toast } from 'react-toastify';
import type { Store } from '../types/store.types';
import type { ShoppingListSuggestion } from '../types/shopping-list.types';

interface PurchaseItem {
  productId: string;
  productName: string;
  quantity: number;
  unitTypeId: number;
  unitAbbreviation: string;
  suggestedQuantity: number;
  unitPrice: number;
  done: boolean;
}

export default function QuickPurchasePage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [items, setItems] = useState<PurchaseItem[]>([]);

  // Fetch stores
  const { data: stores, isLoading: loadingStores } = useQuery({
    queryKey: ['stores'],
    queryFn: storesApi.getAll,
  });

  // Fetch shopping list
  const { data: shoppingList, isLoading: loadingList } = useQuery({
    queryKey: ['shoppingList'],
    queryFn: shoppingListApi.getSuggestions,
    enabled: !!selectedStore,
  });

  // Initialize items when shopping list loads
  const initializeItems = (list: ShoppingListSuggestion[]) => {
    setItems(
      list.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        quantity: item.suggestedQuantity,
        unitTypeId: 0, // will use default
        unitAbbreviation: item.unitAbbreviation,
        suggestedQuantity: item.suggestedQuantity,
        unitPrice: item.lowestKnownPrice ?? 0,
        done: false,
      }))
    );
  };

  // Initialize when shopping list arrives and items are empty
  if (shoppingList && items.length === 0 && shoppingList.length > 0) {
    initializeItems(shoppingList);
  }

  // Submit mutation
  const submitMutation = useMutation({
    mutationFn: () => {
      const doneItems = items.filter((i) => i.done);
      return purchasesApi.quickPurchase({
        storeId: selectedStore!.id,
        items: doneItems.map((i) => ({
          productId: i.productId,
          quantity: i.quantity,
          unitTypeId: i.unitTypeId,
          unitPrice: i.unitPrice,
        })),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['shoppingList'] });
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Compra registrada exitosamente');
      navigate('/purchases');
    },
    onError: () => {
      toast.error('Error al registrar la compra');
    },
  });

  const updateItem = (index: number, field: keyof PurchaseItem, value: number | boolean) => {
    setItems((prev) => prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const doneCount = items.filter((i) => i.done).length;
  const total = items.filter((i) => i.done).reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);

  const handleSubmit = () => {
    if (doneCount === 0) {
      toast.warning('Marca al menos un producto como comprado');
      return;
    }
    submitMutation.mutate();
  };

  // Step 1: Select store
  if (!selectedStore) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <PageHeader title="Compra rapida" subtitle="Selecciona la tienda donde estas comprando" />

          {loadingStores && <p className="text-gray-500 dark:text-gray-400">Cargando tiendas...</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stores?.map((store) => (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 text-left hover:ring-2 hover:ring-blue-500 transition-all min-h-[48px] flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center shrink-0">
                  <StoreIcon size={24} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 dark:text-white truncate">{store.name}</p>
                  {store.address && (
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{store.address}</p>
                  )}
                </div>
                <ChevronRight size={20} className="text-gray-400 shrink-0" />
              </button>
            ))}
          </div>

          {stores && stores.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No hay tiendas registradas.</p>
              <button
                onClick={() => navigate('/stores')}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 text-sm transition-colors min-h-[48px]"
              >
                Agregar tienda
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Step 2: Purchase items
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-24">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <PageHeader
          title="Compra rapida"
          subtitle={`Comprando en ${selectedStore.name}`}
        >
          <button
            onClick={() => {
              setSelectedStore(null);
              setItems([]);
            }}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline min-h-[48px]"
          >
            Cambiar tienda
          </button>
        </PageHeader>

        {loadingList && <p className="text-gray-500 dark:text-gray-400">Cargando lista de compras...</p>}

        {items.length === 0 && !loadingList && (
          <div className="text-center py-12">
            <ShoppingCart size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Tu lista de compras esta vacia.</p>
          </div>
        )}

        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={item.productId}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-opacity ${
                item.done ? 'opacity-60' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <p className="font-semibold text-gray-800 dark:text-white text-lg">{item.productName}</p>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Sugerido: {item.suggestedQuantity} {item.unitAbbreviation}
                </span>
              </div>

              <div className="flex flex-wrap items-end gap-4">
                {/* Quantity */}
                <div className="flex-1 min-w-[120px]">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Cantidad</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    value={item.quantity}
                    onChange={(e) => updateItem(idx, 'quantity', parseFloat(e.target.value) || 0)}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-2 text-lg min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Price */}
                <div className="flex-1 min-w-[140px]">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Precio unitario</label>
                  <div className="relative">
                    <DollarSign size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) => updateItem(idx, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-white pl-9 pr-3 py-2 text-lg min-h-[48px] focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Done button */}
                <button
                  onClick={() => updateItem(idx, 'done', !item.done)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm min-h-[48px] transition-colors ${
                    item.done
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                  }`}
                >
                  <Check size={18} />
                  Comprado
                </button>
              </div>

              {item.done && item.quantity > 0 && item.unitPrice > 0 && (
                <p className="mt-2 text-right text-sm text-gray-500 dark:text-gray-400">
                  Subtotal: {formatCurrency(item.quantity * item.unitPrice)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sticky footer */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg z-10">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{doneCount} de {items.length} productos</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">Total: {formatCurrency(total)}</p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitMutation.isPending || doneCount === 0}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium rounded-lg px-6 py-3 text-base min-h-[48px] transition-colors"
            >
              <ShoppingCart size={20} />
              {submitMutation.isPending ? 'Registrando...' : 'Finalizar compra'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
