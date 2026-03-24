import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, Package, ShoppingCart, Store, Warehouse, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../../hooks/useProducts';
import { useStores } from '../../hooks/useStores';
import { usePurchases } from '../../hooks/usePurchases';

interface SearchResult {
  id: string;
  label: string;
  sublabel?: string;
  type: 'product' | 'store' | 'purchase' | 'page';
  path: string;
  icon: typeof Package;
}

const PAGES: SearchResult[] = [
  { id: 'page-dashboard', label: 'Dashboard', type: 'page', path: '/', icon: FileText },
  { id: 'page-shopping', label: 'Lista de compras', type: 'page', path: '/shopping-list', icon: ShoppingCart },
  { id: 'page-purchases', label: 'Compras', type: 'page', path: '/purchases', icon: ShoppingCart },
  { id: 'page-inventory', label: 'Inventario', type: 'page', path: '/inventory', icon: Warehouse },
  { id: 'page-products', label: 'Productos', type: 'page', path: '/products', icon: Package },
  { id: 'page-stores', label: 'Tiendas', type: 'page', path: '/stores', icon: Store },
  { id: 'page-prices', label: 'Comparacion de precios', type: 'page', path: '/prices', icon: FileText },
  { id: 'page-savings', label: 'Ahorro', type: 'page', path: '/savings', icon: FileText },
  { id: 'page-budget', label: 'Presupuesto', type: 'page', path: '/budget', icon: FileText },
  { id: 'page-statistics', label: 'Estadisticas', type: 'page', path: '/statistics', icon: FileText },
  { id: 'page-calendar', label: 'Calendario', type: 'page', path: '/calendar', icon: FileText },
  { id: 'page-templates', label: 'Plantillas', type: 'page', path: '/templates', icon: FileText },
  { id: 'page-recipes', label: 'Recetas', type: 'page', path: '/recipes', icon: FileText },
];

export default function GlobalSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { data: products } = useProducts();
  const { data: stores } = useStores();
  const { data: purchases } = usePurchases();

  // Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  const results = useMemo(() => {
    if (!query.trim()) return PAGES.slice(0, 8);

    const q = query.toLowerCase();
    const items: SearchResult[] = [];

    // Search products
    products?.forEach((p) => {
      if (p.name.toLowerCase().includes(q) || p.brand?.toLowerCase().includes(q)) {
        items.push({
          id: `prod-${p.id}`,
          label: p.name,
          sublabel: p.brand || p.categoryName,
          type: 'product',
          path: `/products`,
          icon: Package,
        });
      }
    });

    // Search stores
    stores?.forEach((s) => {
      if (s.name.toLowerCase().includes(q) || s.city?.toLowerCase().includes(q)) {
        items.push({
          id: `store-${s.id}`,
          label: s.name,
          sublabel: s.city,
          type: 'store',
          path: '/stores',
          icon: Store,
        });
      }
    });

    // Search purchases
    purchases?.forEach((p) => {
      if (p.storeName?.toLowerCase().includes(q) || p.notes?.toLowerCase().includes(q)) {
        items.push({
          id: `purch-${p.id}`,
          label: `Compra en ${p.storeName}`,
          sublabel: new Date(p.purchaseDateUtc).toLocaleDateString('es'),
          type: 'purchase',
          path: `/purchases/${p.id}/edit`,
          icon: ShoppingCart,
        });
      }
    });

    // Search pages
    PAGES.forEach((page) => {
      if (page.label.toLowerCase().includes(q)) {
        items.push(page);
      }
    });

    return items.slice(0, 10);
  }, [query, products, stores, purchases]);

  const handleSelect = useCallback(
    (result: SearchResult) => {
      setOpen(false);
      navigate(result.path);
    },
    [navigate],
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      handleSelect(results[selectedIndex]);
    }
  };

  const typeColors: Record<string, string> = {
    product: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    store: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    purchase: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
    page: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
  };

  const typeLabels: Record<string, string> = {
    product: 'Producto',
    store: 'Tienda',
    purchase: 'Compra',
    page: 'Pagina',
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={() => setOpen(false)}
          />

          {/* Search modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-50"
          >
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              {/* Input */}
              <div className="flex items-center px-4 border-b border-gray-200 dark:border-gray-700">
                <Search size={20} className="text-gray-400 shrink-0" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder="Buscar productos, tiendas, compras, paginas..."
                  className="w-full px-3 py-4 bg-transparent text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none text-sm"
                />
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {/* Results */}
              <div className="max-h-80 overflow-y-auto py-2">
                {results.length === 0 ? (
                  <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400 text-sm">
                    No se encontraron resultados
                  </div>
                ) : (
                  results.map((result, i) => {
                    const Icon = result.icon;
                    return (
                      <button
                        key={result.id}
                        onClick={() => handleSelect(result)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                          i === selectedIndex
                            ? 'bg-blue-50 dark:bg-blue-900/20'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700/50'
                        }`}
                      >
                        <Icon size={18} className="text-gray-400 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white truncate">
                            {result.label}
                          </p>
                          {result.sublabel && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                              {result.sublabel}
                            </p>
                          )}
                        </div>
                        <span className={`text-xs px-2 py-0.5 rounded-full shrink-0 ${typeColors[result.type]}`}>
                          {typeLabels[result.type]}
                        </span>
                      </button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 flex items-center gap-4 text-xs text-gray-400">
                <span><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">↑↓</kbd> navegar</span>
                <span><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">Enter</kbd> seleccionar</span>
                <span><kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-[10px]">Esc</kbd> cerrar</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
