import { useState, useMemo, useCallback } from 'react';
import {
  ShoppingCart,
  Check,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Search,
  Store,
  AlertTriangle,
  Package,
  RefreshCw,
  Sparkles,
  Clock,
  TrendingDown,
  ShoppingBag,
  XCircle,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import {
  useShoppingList,
  useGenerateShoppingList,
} from '../hooks/useShoppingList';
import { ShoppingListSuggestion } from '../types/shopping-list.types';
import { formatCurrency } from '../utils/format';

// ---------------------------------------------------------------------------
// Constants & helpers
// ---------------------------------------------------------------------------

type ReasonKey = 'OutOfStock' | 'LowStock' | 'BelowAverage' | 'FrequentlyPurchased';
type FilterTab = 'Todos' | 'Urgentes' | 'PorTienda';

const REASON_META: Record<
  ReasonKey,
  {
    label: string;
    badgeBg: string;
    badgeText: string;
    headerBg: string;
    headerBorder: string;
    iconBg: string;
    progressBar: string;
    icon: typeof AlertTriangle;
  }
> = {
  OutOfStock: {
    label: 'Sin Stock',
    badgeBg: 'bg-red-100 dark:bg-red-900/40',
    badgeText: 'text-red-700 dark:text-red-300',
    headerBg: 'bg-red-50 dark:bg-red-900/20',
    headerBorder: 'border-red-200 dark:border-red-800',
    iconBg: 'bg-red-500',
    progressBar: 'bg-red-500',
    icon: XCircle,
  },
  LowStock: {
    label: 'Stock Bajo',
    badgeBg: 'bg-amber-100 dark:bg-amber-900/40',
    badgeText: 'text-amber-700 dark:text-amber-300',
    headerBg: 'bg-amber-50 dark:bg-amber-900/20',
    headerBorder: 'border-amber-200 dark:border-amber-800',
    iconBg: 'bg-amber-500',
    progressBar: 'bg-amber-500',
    icon: AlertTriangle,
  },
  BelowAverage: {
    label: 'Bajo Promedio',
    badgeBg: 'bg-blue-100 dark:bg-blue-900/40',
    badgeText: 'text-blue-700 dark:text-blue-300',
    headerBg: 'bg-blue-50 dark:bg-blue-900/20',
    headerBorder: 'border-blue-200 dark:border-blue-800',
    iconBg: 'bg-blue-500',
    progressBar: 'bg-blue-500',
    icon: TrendingDown,
  },
  FrequentlyPurchased: {
    label: 'Compra Frecuente',
    badgeBg: 'bg-purple-100 dark:bg-purple-900/40',
    badgeText: 'text-purple-700 dark:text-purple-300',
    headerBg: 'bg-purple-50 dark:bg-purple-900/20',
    headerBorder: 'border-purple-200 dark:border-purple-800',
    iconBg: 'bg-purple-500',
    progressBar: 'bg-purple-500',
    icon: ShoppingBag,
  },
};

const REASON_ORDER: ReasonKey[] = [
  'OutOfStock',
  'LowStock',
  'BelowAverage',
  'FrequentlyPurchased',
];

function getMeta(reason: string) {
  return (
    REASON_META[reason as ReasonKey] ?? {
      label: reason,
      badgeBg: 'bg-gray-100 dark:bg-gray-700',
      badgeText: 'text-gray-700 dark:text-gray-300',
      headerBg: 'bg-gray-50 dark:bg-gray-800',
      headerBorder: 'border-gray-200 dark:border-gray-700',
      iconBg: 'bg-gray-500',
      progressBar: 'bg-gray-500',
      icon: Package,
    }
  );
}

function estimateDaysRemaining(currentStock: number): number | null {
  if (currentStock <= 0) return 0;
  // rough heuristic: assume ~1 unit/day consumption
  return Math.max(0, Math.round(currentStock));
}

// ---------------------------------------------------------------------------
// Extended local item with mutable quantity
// ---------------------------------------------------------------------------

interface LocalItem extends ShoppingListSuggestion {
  localQty: number;
  checked: boolean;
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ItemCard({
  item,
  onToggle,
  onQtyChange,
}: {
  item: LocalItem;
  onToggle: (id: string) => void;
  onQtyChange: (id: string, delta: number) => void;
}) {
  const meta = getMeta(item.reason);
  const IconComponent = meta.icon;
  const stockPercent =
    item.currentStock + item.localQty > 0
      ? Math.round(
          (item.currentStock / (item.currentStock + item.localQty)) * 100,
        )
      : 0;
  const estimatedPrice =
    item.lowestKnownPrice != null ? item.lowestKnownPrice * item.localQty : null;
  const daysLeft = estimateDaysRemaining(item.currentStock);

  return (
    <div
      className={`
        bg-white dark:bg-gray-800 rounded-xl shadow-md
        border border-gray-100 dark:border-gray-700
        transition-all duration-300 ease-in-out
        ${item.checked ? 'opacity-60 scale-[0.98]' : 'hover:shadow-lg hover:-translate-y-0.5'}
      `}
    >
      <div className="flex items-start gap-3 p-4">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(item.productId)}
          className={`
            mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center
            transition-all duration-300
            ${
              item.checked
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
            }
          `}
        >
          {item.checked && <Check className="w-3.5 h-3.5" />}
        </button>

        {/* Category icon */}
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-lg ${meta.iconBg} flex items-center justify-center`}
        >
          <IconComponent className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4
                className={`font-semibold text-gray-900 dark:text-white truncate transition-all duration-300 ${
                  item.checked ? 'line-through text-gray-400 dark:text-gray-500' : ''
                }`}
              >
                {item.productName}
              </h4>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span
                  className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${meta.badgeBg} ${meta.badgeText}`}
                >
                  {meta.label}
                </span>
                {daysLeft !== null && daysLeft <= 7 && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <Clock className="w-3 h-3" />~{daysLeft} días
                  </span>
                )}
                {item.lowestPriceStore && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                    <MapPin className="w-3 h-3" />
                    {item.lowestPriceStore}
                  </span>
                )}
              </div>
            </div>

            {/* Estimated price */}
            {estimatedPrice != null && !item.checked && (
              <span className="text-sm font-bold text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {formatCurrency(estimatedPrice)}
              </span>
            )}
          </div>

          {/* Progress bar */}
          {!item.checked && (
            <div className="mt-3">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                <span>
                  Stock: {item.currentStock} {item.unitAbbreviation}
                </span>
                <span>
                  Necesitas: {item.localQty} {item.unitAbbreviation}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${meta.progressBar}`}
                  style={{ width: `${stockPercent}%` }}
                />
              </div>
            </div>
          )}

          {/* Quantity adjuster */}
          {!item.checked && (
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Reducir cantidad"
                  onClick={() => onQtyChange(item.productId, -1)}
                  disabled={item.localQty <= 1}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center
                    text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600
                    disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-900 dark:text-white">
                  {item.localQty}
                </span>
                <button
                  type="button"
                  aria-label="Aumentar cantidad"
                  onClick={() => onQtyChange(item.productId, 1)}
                  className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center
                    text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600
                    transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {item.unitAbbreviation}
                </span>
              </div>

              {item.lowestKnownPrice != null && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {formatCurrency(item.lowestKnownPrice)} / {item.unitAbbreviation}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Collapsible group
// ---------------------------------------------------------------------------

function CollapsibleGroup({
  title,
  count,
  reason,
  children,
  defaultOpen = true,
}: {
  title: string;
  count: number;
  reason?: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  const meta = reason ? getMeta(reason) : null;

  return (
    <div className="mb-6">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`
          w-full flex items-center justify-between px-4 py-3 rounded-xl
          border transition-colors
          ${
            meta
              ? `${meta.headerBg} ${meta.headerBorder}`
              : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700'
          }
        `}
      >
        <div className="flex items-center gap-2">
          {meta && (
            <div
              className={`w-3 h-3 rounded-full ${meta.iconBg}`}
            />
          )}
          <span className="font-semibold text-gray-800 dark:text-white text-sm">
            {title}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-2 py-0.5 rounded-full">
            {count}
          </span>
        </div>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-500" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-500" />
        )}
      </button>

      <div
        className={`
          grid gap-3 mt-3 transition-all duration-300 origin-top
          ${open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden max-h-0'}
        `}
      >
        {open && children}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Summary sidebar
// ---------------------------------------------------------------------------

function SummaryPanel({
  items,
  totalCost,
  completedCount,
  totalCount,
}: {
  items: LocalItem[];
  totalCost: number;
  completedCount: number;
  totalCount: number;
}) {
  // Group by store
  const storeGroups = useMemo(() => {
    const map = new Map<string, { items: LocalItem[]; subtotal: number }>();
    items
      .filter((i) => !i.checked && i.lowestPriceStore)
      .forEach((item) => {
        const store = item.lowestPriceStore!;
        const existing = map.get(store) ?? { items: [], subtotal: 0 };
        existing.items.push(item);
        existing.subtotal +=
          (item.lowestKnownPrice ?? 0) * item.localQty;
        map.set(store, existing);
      });
    return Array.from(map.entries()).sort((a, b) => b[1].subtotal - a[1].subtotal);
  }, [items]);

  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* Progress */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            Progreso
          </h3>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {completedCount}/{totalCount}
          </span>
        </div>
        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          {completedCount === totalCount && totalCount > 0
            ? 'Completaste toda la lista!'
            : `${totalCount - completedCount} items pendientes`}
        </p>
      </div>

      {/* Total cost */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-md p-5 text-white">
        <p className="text-sm text-blue-100 mb-1">Total Estimado</p>
        <p className="text-3xl font-bold tracking-tight">
          {formatCurrency(totalCost)}
        </p>
        <p className="text-xs text-blue-200 mt-2">
          Basado en los mejores precios conocidos
        </p>
      </div>

      {/* Store suggestions */}
      {storeGroups.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 border border-gray-100 dark:border-gray-700">
          <h3 className="font-semibold text-gray-800 dark:text-white flex items-center gap-2 mb-4">
            <Store className="w-5 h-5 text-indigo-500" />
            Por Tienda
          </h3>
          <div className="space-y-3">
            {storeGroups.map(([store, data]) => (
              <div
                key={store}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-sm text-gray-800 dark:text-white">
                    {store}
                  </span>
                  <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                    {formatCurrency(data.subtotal)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Si vas a {store}, compra estos {data.items.length} item
                  {data.items.length !== 1 ? 's' : ''} por{' '}
                  {formatCurrency(data.subtotal)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Urgency alert */}
      {items.some(
        (i) =>
          !i.checked &&
          (i.reason === 'OutOfStock' || (i.reason === 'LowStock' && i.currentStock <= 1)),
      ) && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h4 className="font-semibold text-red-700 dark:text-red-300 text-sm">
              Atención
            </h4>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">
            Tienes productos sin stock o con stock critico. Prioriza estos items
            en tu próxima compra.
          </p>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main page component
// ---------------------------------------------------------------------------

export default function ShoppingListPage() {
  const { data: rawItems, isLoading } = useShoppingList();
  const generateList = useGenerateShoppingList();

  // Local state
  const [checkedSet, setCheckedSet] = useState<Set<string>>(new Set());
  const [qtyOverrides, setQtyOverrides] = useState<Map<string, number>>(new Map());
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<FilterTab>('Todos');
  const [collapsedCompleted, setCollapsedCompleted] = useState(false);

  // Build local items
  const localItems: LocalItem[] = useMemo(() => {
    if (!rawItems) return [];
    return rawItems.map((item) => ({
      ...item,
      localQty: qtyOverrides.get(item.productId) ?? item.suggestedQuantity,
      checked: checkedSet.has(item.productId),
    }));
  }, [rawItems, checkedSet, qtyOverrides]);

  // Handlers
  const handleToggle = useCallback((id: string) => {
    setCheckedSet((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const handleQtyChange = useCallback(
    (id: string, delta: number) => {
      setQtyOverrides((prev) => {
        const next = new Map(prev);
        const item = rawItems?.find((i) => i.productId === id);
        const current = next.get(id) ?? item?.suggestedQuantity ?? 1;
        next.set(id, Math.max(1, current + delta));
        return next;
      });
    },
    [rawItems],
  );

  const handleMarkAll = useCallback(() => {
    if (!rawItems) return;
    setCheckedSet(new Set(rawItems.map((i) => i.productId)));
  }, [rawItems]);

  // Filtering
  const filteredItems = useMemo(() => {
    let result = localItems;

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((i) => i.productName.toLowerCase().includes(q));
    }

    // Tab filter
    if (activeTab === 'Urgentes') {
      result = result.filter(
        (i) => i.reason === 'OutOfStock' || i.reason === 'LowStock',
      );
    }

    return result;
  }, [localItems, searchQuery, activeTab]);

  const pendingItems = filteredItems.filter((i) => !i.checked);
  const completedItems = filteredItems.filter((i) => i.checked);

  // Group items
  const groupedByReason = useMemo(() => {
    const map = new Map<string, LocalItem[]>();
    pendingItems.forEach((item) => {
      const key = item.reason;
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    });
    // Sort by urgency order
    const sorted: [string, LocalItem[]][] = [];
    REASON_ORDER.forEach((r) => {
      const items = map.get(r);
      if (items?.length) sorted.push([r, items]);
    });
    // Any remaining reasons not in REASON_ORDER
    map.forEach((items, reason) => {
      if (!REASON_ORDER.includes(reason as ReasonKey)) {
        sorted.push([reason, items]);
      }
    });
    return sorted;
  }, [pendingItems]);

  const groupedByStore = useMemo(() => {
    const map = new Map<string, LocalItem[]>();
    pendingItems.forEach((item) => {
      const key = item.lowestPriceStore || 'Sin tienda asignada';
      const arr = map.get(key) ?? [];
      arr.push(item);
      map.set(key, arr);
    });
    return Array.from(map.entries()).sort((a, b) => b[1].length - a[1].length);
  }, [pendingItems]);

  // Totals
  const totalCost = useMemo(
    () =>
      localItems
        .filter((i) => !i.checked)
        .reduce((s, i) => s + (i.lowestKnownPrice ?? 0) * i.localQty, 0),
    [localItems],
  );
  const completedCount = localItems.filter((i) => i.checked).length;
  const totalCount = localItems.length;
  const pendingCount = totalCount - completedCount;

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  // Loading
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] gap-3">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400">Cargando lista...</p>
      </div>
    );
  }

  // Empty
  if (!rawItems || rawItems.length === 0) {
    return (
      <div>
        <PageHeader
          title="Lista de Compras"
          subtitle="Sugerencias inteligentes basadas en tu inventario"
        />
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-4 py-8">
          <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <ShoppingCart className="w-10 h-10 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300">
            Lista vacía
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
            Genera una lista de compras inteligente basada en tu inventario actual y tus
            hábitos de consumo.
          </p>
          <button
            type="button"
            onClick={() => generateList.mutate()}
            disabled={generateList.isPending}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium
              rounded-xl px-6 py-3 text-sm transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            {generateList.isPending ? 'Generando...' : 'Generar Lista'}
          </button>
        </div>
      </div>
    );
  }

  const filterTabs: { key: FilterTab; label: string }[] = [
    { key: 'Todos', label: 'Todos' },
    { key: 'Urgentes', label: 'Urgentes' },
    { key: 'PorTienda', label: 'Por Tienda' },
  ];

  return (
    <div className="pb-24 lg:pb-0">
      {/* Header */}
      <PageHeader
        title="Lista de Compras"
        subtitle="Sugerencias inteligentes basadas en tu inventario"
      >
        <button
          type="button"
          onClick={() => generateList.mutate()}
          disabled={generateList.isPending}
          className="inline-flex items-center gap-2 border border-gray-300 dark:border-gray-600
            text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800
            hover:bg-gray-50 dark:hover:bg-gray-700
            font-medium rounded-xl px-4 py-2 text-sm transition-colors disabled:opacity-50"
        >
          <RefreshCw
            className={`w-4 h-4 ${generateList.isPending ? 'animate-spin' : ''}`}
          />
          Regenerar
        </button>
      </PageHeader>

      {/* Mobile summary */}
      <div className="lg:hidden mb-5">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-4 text-white shadow-md">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-blue-100">Total Estimado</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCost)}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-blue-100">Progreso</p>
              <p className="text-lg font-bold">
                {completedCount}/{totalCount}
              </p>
            </div>
          </div>
          <div className="w-full h-2 bg-blue-400/30 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full bg-white/80 transition-all duration-500"
              style={{
                width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-6">
        {/* Tabs */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 gap-1">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${
                  activeTab === tab.key
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 w-full sm:w-auto sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar producto..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm
              placeholder:text-gray-400 dark:placeholder:text-gray-500
              focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500
              transition-all"
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex gap-6">
        {/* Left: item list */}
        <div className="flex-1 min-w-0">
          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3">
              <Search className="w-10 h-10 text-gray-300 dark:text-gray-600" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No se encontraron productos
              </p>
            </div>
          ) : (
            <>
              {/* Pending items grouped */}
              {activeTab === 'PorTienda'
                ? groupedByStore.map(([store, storeItems]) => (
                    <CollapsibleGroup
                      key={store}
                      title={store}
                      count={storeItems.length}
                    >
                      {storeItems.map((item) => (
                        <ItemCard
                          key={item.productId}
                          item={item}
                          onToggle={handleToggle}
                          onQtyChange={handleQtyChange}
                        />
                      ))}
                    </CollapsibleGroup>
                  ))
                : groupedByReason.map(([reason, reasonItems]) => (
                    <CollapsibleGroup
                      key={reason}
                      title={getMeta(reason).label}
                      count={reasonItems.length}
                      reason={reason}
                    >
                      {reasonItems.map((item) => (
                        <ItemCard
                          key={item.productId}
                          item={item}
                          onToggle={handleToggle}
                          onQtyChange={handleQtyChange}
                        />
                      ))}
                    </CollapsibleGroup>
                  ))}

              {/* Completed items */}
              {completedItems.length > 0 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setCollapsedCompleted((c) => !c)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl
                      bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800
                      transition-colors mb-3"
                  >
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">
                        Completados
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400 bg-white/60 dark:bg-gray-700/60 px-2 py-0.5 rounded-full">
                        {completedItems.length}
                      </span>
                    </div>
                    {collapsedCompleted ? (
                      <ChevronDown className="w-4 h-4 text-gray-500" />
                    ) : (
                      <ChevronUp className="w-4 h-4 text-gray-500" />
                    )}
                  </button>
                  {!collapsedCompleted && (
                    <div className="grid gap-3">
                      {completedItems.map((item) => (
                        <ItemCard
                          key={item.productId}
                          item={item}
                          onToggle={handleToggle}
                          onQtyChange={handleQtyChange}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Right sidebar (desktop only) */}
        <div className="hidden lg:block w-80 flex-shrink-0">
          <div className="sticky top-6">
            <SummaryPanel
              items={localItems}
              totalCost={totalCost}
              completedCount={completedCount}
              totalCount={totalCount}
            />
          </div>
        </div>
      </div>

      {/* Sticky mobile footer */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        <div
          className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700
            px-4 py-3 flex items-center justify-between gap-3"
        >
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
              {pendingCount} pendiente{pendingCount !== 1 ? 's' : ''} |{' '}
              <span className="text-blue-600 dark:text-blue-400">
                {formatCurrency(totalCost)}
              </span>
            </p>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleMarkAll}
              className="px-4 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white
                text-sm font-medium transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              Listo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
