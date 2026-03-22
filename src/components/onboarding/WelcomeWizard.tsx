import { useState } from 'react';
import { ShoppingCart, Store, Package, PartyPopper, Check } from 'lucide-react';
import { useOnboarding } from '../../hooks/useOnboarding';
import { useOnboardingStore } from '../../stores/onboarding.store';
import { useCreateStore } from '../../hooks/useStores';
import { useCreateProduct } from '../../hooks/useProducts';
// Category IDs from DB: 1=Lacteos, 2=Carnes, 3=Frutas, 4=Cereales, 5=Bebidas, 6=Limpieza, 7=Higiene, 8=Enlatados, 9=Condimentos, 10=Panaderia
// UnitType IDs from DB: 1=ml, 2=L, 3=g, 4=kg, 5=ud, 6=pz

interface CommonProduct {
  name: string;
  categoryId: number;
  defaultUnitTypeId: number;
  defaultQuantity: number;
}

const COMMON_PRODUCTS: CommonProduct[] = [
  { name: 'Leche', categoryId: 1, defaultUnitTypeId: 2, defaultQuantity: 1 },
  { name: 'Huevos', categoryId: 1, defaultUnitTypeId: 5, defaultQuantity: 12 },
  { name: 'Arroz', categoryId: 4, defaultUnitTypeId: 4, defaultQuantity: 1 },
  { name: 'Frijoles', categoryId: 4, defaultUnitTypeId: 4, defaultQuantity: 1 },
  { name: 'Pan', categoryId: 10, defaultUnitTypeId: 5, defaultQuantity: 1 },
  { name: 'Aceite', categoryId: 9, defaultUnitTypeId: 2, defaultQuantity: 1 },
  { name: 'Azucar', categoryId: 9, defaultUnitTypeId: 4, defaultQuantity: 1 },
  { name: 'Sal', categoryId: 9, defaultUnitTypeId: 4, defaultQuantity: 1 },
  { name: 'Pasta', categoryId: 4, defaultUnitTypeId: 4, defaultQuantity: 0.2 },
  { name: 'Atun', categoryId: 8, defaultUnitTypeId: 5, defaultQuantity: 1 },
];

export default function WelcomeWizard() {
  const { isComplete, wizardCompleted, storesCount, productsCount } = useOnboarding();
  const setWizardCompleted = useOnboardingStore((s) => s.setWizardCompleted);

  const [currentStep, setCurrentStep] = useState(0);

  // Store form
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeCity, setStoreCity] = useState('');
  const [storeAdded, setStoreAdded] = useState(false);

  // Products
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [productsAdded, setProductsAdded] = useState(false);
  const [addingProducts, setAddingProducts] = useState(false);

  const createStore = useCreateStore();
  const createProduct = useCreateProduct();

  // Don't show if wizard completed or onboarding is complete
  if (wizardCompleted || isComplete) return null;

  const totalSteps = 4;

  const handleSkipAll = () => {
    setWizardCompleted();
  };

  const handleNext = () => {
    setCurrentStep((s) => Math.min(s + 1, totalSteps - 1));
  };

  const handleAddStore = () => {
    if (!storeName.trim()) return;
    createStore.mutate(
      {
        name: storeName.trim(),
        address: storeAddress.trim() || undefined,
        city: storeCity.trim() || undefined,
      },
      {
        onSuccess: () => {
          setStoreAdded(true);
        },
      },
    );
  };

  const handleToggleProduct = (index: number) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleAddProducts = async () => {
    if (selectedProducts.size === 0) return;
    setAddingProducts(true);
    const productsToAdd = Array.from(selectedProducts).map((i) => COMMON_PRODUCTS[i]);

    for (const product of productsToAdd) {
      try {
        await createProduct.mutateAsync({
          name: product.name,
          categoryId: product.categoryId,
          defaultUnitTypeId: product.defaultUnitTypeId,
          defaultQuantity: product.defaultQuantity,
        });
      } catch {
        // Continue with remaining products
      }
    }

    setAddingProducts(false);
    setProductsAdded(true);
  };

  const handleFinish = () => {
    setWizardCompleted();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden">
        {/* Progress dots */}
        <div className="flex items-center justify-center gap-2 pt-6">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                i === currentStep
                  ? 'bg-blue-600 w-8'
                  : i < currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-300 dark:bg-gray-600'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="p-8">
          {/* Step 1: Welcome */}
          {currentStep === 0 && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShoppingCart className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Bienvenido a Mis compras
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed">
                Controla tu inventario, registra tus compras, compara precios entre tiendas
                y genera listas de compras inteligentes. Te ayudaremos a configurar todo en
                unos pocos pasos.
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
              >
                Empezar
              </button>
            </div>
          )}

          {/* Step 2: Add store */}
          {currentStep === 1 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <Store className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Agrega tu primera tienda
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Donde sueles hacer tus compras
                  </p>
                </div>
              </div>

              {storeAdded ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                    Tienda agregada
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Puedes agregar mas tiendas despues desde el menu
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      placeholder="Ej: Supermercado La Feria"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Direccion
                    </label>
                    <input
                      type="text"
                      value={storeAddress}
                      onChange={(e) => setStoreAddress(e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Ciudad
                    </label>
                    <input
                      type="text"
                      value={storeCity}
                      onChange={(e) => setStoreCity(e.target.value)}
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {!storeAdded ? (
                  <>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Saltar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddStore}
                      disabled={!storeName.trim() || createStore.isPending}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createStore.isPending ? 'Agregando...' : 'Agregar'}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Add products */}
          {currentStep === 2 && (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Agrega tus productos
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Selecciona los productos que compras habitualmente
                  </p>
                </div>
              </div>

              {productsAdded ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <p className="text-lg font-semibold text-green-600 dark:text-green-400 mb-2">
                    {selectedProducts.size} producto{selectedProducts.size !== 1 ? 's' : ''} agregado{selectedProducts.size !== 1 ? 's' : ''}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Puedes agregar mas productos despues
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {COMMON_PRODUCTS.map((product, index) => (
                    <button
                      key={product.name}
                      type="button"
                      onClick={() => handleToggleProduct(index)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${
                        selectedProducts.has(index)
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                          : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          selectedProducts.has(index)
                            ? 'border-blue-500 bg-blue-500 text-white'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {selectedProducts.has(index) && <Check className="w-3 h-3" />}
                      </div>
                      {product.name}
                    </button>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                {!productsAdded ? (
                  <>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-xl px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Saltar
                    </button>
                    <button
                      type="button"
                      onClick={handleAddProducts}
                      disabled={selectedProducts.size === 0 || addingProducts}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-4 py-2.5 text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addingProducts
                        ? 'Agregando...'
                        : `Agregar seleccionados (${selectedProducts.size})`}
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-2.5 transition-colors"
                  >
                    Siguiente
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Step 4: Done */}
          {currentStep === 3 && (
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <PartyPopper className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                Listo!
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-2">
                Agregaste {storesCount} tienda{storesCount !== 1 ? 's' : ''} y{' '}
                {productsCount} producto{productsCount !== 1 ? 's' : ''}.
              </p>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Ahora puedes registrar tu inventario y comenzar a controlar tus compras.
              </p>
              <button
                type="button"
                onClick={handleFinish}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl px-6 py-3 transition-colors"
              >
                Ir al dashboard
              </button>
            </div>
          )}
        </div>

        {/* Skip all link */}
        {currentStep < 3 && (
          <div className="pb-6 text-center">
            <button
              type="button"
              onClick={handleSkipAll}
              className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              Saltar todo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
