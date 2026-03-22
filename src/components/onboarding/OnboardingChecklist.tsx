import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Rocket,
  CheckCircle2,
  Circle,
  ChevronRight,
  X,
} from 'lucide-react';
import { useOnboarding } from '../../hooks/useOnboarding';

const LOCALSTORAGE_KEY = 'onboarding-checklist-hidden';

export default function OnboardingChecklist() {
  const {
    hasStores,
    hasProducts,
    hasInventory,
    hasPurchases,
    isComplete,
    completedSteps,
    totalSteps,
    storesCount,
    productsCount,
    inventoryCount,
    purchasesCount,
  } = useOnboarding();

  const [hidden, setHidden] = useState(
    () => localStorage.getItem(LOCALSTORAGE_KEY) === 'true',
  );

  if (isComplete || hidden) return null;

  const handleHide = () => {
    localStorage.setItem(LOCALSTORAGE_KEY, 'true');
    setHidden(true);
  };

  const progressPercent = (completedSteps / totalSteps) * 100;

  const steps = [
    {
      done: hasStores,
      label: 'Agregar al menos una tienda',
      detail: `${storesCount} tienda${storesCount !== 1 ? 's' : ''}`,
      path: '/stores',
      linkLabel: 'Ir a tiendas',
    },
    {
      done: hasProducts,
      label: 'Agregar al menos un producto',
      detail: `${productsCount} producto${productsCount !== 1 ? 's' : ''}`,
      path: '/products',
      linkLabel: 'Ir a productos',
    },
    {
      done: hasInventory,
      label: 'Registrar inventario',
      detail: `${inventoryCount} item${inventoryCount !== 1 ? 's' : ''}`,
      path: '/inventory',
      linkLabel: 'Ir al inventario',
    },
    {
      done: hasPurchases,
      label: 'Registrar primera compra',
      detail: `${purchasesCount} compra${purchasesCount !== 1 ? 's' : ''}`,
      path: '/purchases/new',
      linkLabel: 'Registrar compra',
    },
  ];

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800/50 p-5 mb-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center flex-shrink-0">
            <Rocket className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
              Configura tu sistema
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {completedSteps} de {totalSteps} completados
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleHide}
          className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
          aria-label="Ocultar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-blue-100 dark:bg-blue-900/40 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-blue-600 dark:bg-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps */}
      <div className="space-y-2">
        {steps.map((step) => (
          <div
            key={step.label}
            className={`flex items-center justify-between py-2 px-3 rounded-lg transition-colors ${
              step.done
                ? 'bg-white/50 dark:bg-gray-800/30'
                : 'bg-white/80 dark:bg-gray-800/50'
            }`}
          >
            <div className="flex items-center gap-3 min-w-0">
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 dark:text-gray-600 flex-shrink-0" />
              )}
              <div className="min-w-0">
                <p
                  className={`text-sm font-medium truncate ${
                    step.done
                      ? 'text-gray-500 dark:text-gray-400 line-through'
                      : 'text-gray-800 dark:text-white'
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  {step.detail}
                </p>
              </div>
            </div>
            {!step.done && (
              <Link
                to={step.path}
                className="flex items-center gap-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 whitespace-nowrap transition-colors"
              >
                {step.linkLabel}
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
