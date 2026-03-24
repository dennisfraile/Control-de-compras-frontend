import { useState, useEffect, type ReactNode } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TooltipStep {
  key: string;
  title: string;
  description: string;
}

const SECTION_TOOLTIPS: Record<string, TooltipStep> = {
  '/': {
    key: 'dashboard',
    title: 'Bienvenido al dashboard',
    description: 'Aqui puedes ver un resumen general de tus compras, stock bajo y gastos del mes.',
  },
  '/shopping-list': {
    key: 'shopping-list',
    title: 'Tu lista de compras inteligente',
    description: 'La lista se genera automaticamente basada en tu inventario y habitos de compra.',
  },
  '/purchases': {
    key: 'purchases',
    title: 'Historial de compras',
    description: 'Registra tus compras y lleva un control detallado de tus gastos.',
  },
  '/inventory': {
    key: 'inventory',
    title: 'Control de inventario',
    description: 'Gestiona el stock de tus productos. Usa los botones +/- para ajustar cantidades rapidamente.',
  },
  '/products': {
    key: 'products',
    title: 'Catalogo de productos',
    description: 'Administra tu catalogo de productos con categorias, marcas y codigos de barras.',
  },
  '/stores': {
    key: 'stores',
    title: 'Tus tiendas',
    description: 'Registra las tiendas donde haces tus compras para comparar precios.',
  },
  '/prices': {
    key: 'prices',
    title: 'Comparacion de precios',
    description: 'Compara precios entre tiendas y encuentra las mejores ofertas.',
  },
  '/budget': {
    key: 'budget',
    title: 'Presupuesto',
    description: 'Establece un presupuesto mensual y controla tu gasto.',
  },
  '/statistics': {
    key: 'statistics',
    title: 'Estadisticas',
    description: 'Analiza tus patrones de compra con graficas detalladas.',
  },
};

const STORAGE_KEY = 'onboarding-tooltips-seen';

function getSeenTooltips(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  } catch {
    return new Set();
  }
}

function markTooltipSeen(key: string) {
  const seen = getSeenTooltips();
  seen.add(key);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen]));
}

export default function OnboardingTooltip({ pathname }: { pathname: string }) {
  const [visible, setVisible] = useState(false);
  const tooltip = SECTION_TOOLTIPS[pathname];

  useEffect(() => {
    if (!tooltip) {
      setVisible(false);
      return;
    }

    const seen = getSeenTooltips();
    if (seen.has(tooltip.key)) {
      setVisible(false);
      return;
    }

    // Show after a small delay
    const timer = setTimeout(() => setVisible(true), 800);
    return () => clearTimeout(timer);
  }, [pathname, tooltip]);

  const handleDismiss = () => {
    if (tooltip) markTooltipSeen(tooltip.key);
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && tooltip && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-blue-600 text-white rounded-xl p-4 mb-4 shadow-lg relative"
        >
          <button
            onClick={handleDismiss}
            className="absolute top-2 right-2 p-1 hover:bg-blue-500 rounded-lg transition-colors"
          >
            <X size={16} />
          </button>
          <h3 className="font-semibold text-sm mb-1">{tooltip.title}</h3>
          <p className="text-blue-100 text-xs leading-relaxed">{tooltip.description}</p>
          <button
            onClick={handleDismiss}
            className="mt-2 flex items-center gap-1 text-xs font-medium text-blue-200 hover:text-white transition-colors"
          >
            Entendido <ChevronRight size={12} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
