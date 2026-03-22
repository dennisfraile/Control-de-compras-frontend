import { useMemo } from 'react';
import { useStores } from './useStores';
import { useProducts } from './useProducts';
import { useInventory } from './useInventory';
import { usePurchases } from './usePurchases';
import { useOnboardingStore } from '../stores/onboarding.store';

export function useOnboarding() {
  const { data: stores } = useStores();
  const { data: products } = useProducts();
  const { data: inventory } = useInventory();
  const { data: purchases } = usePurchases();
  const wizardCompleted = useOnboardingStore((s) => s.wizardCompleted);

  const hasStores = (stores?.length ?? 0) > 0;
  const hasProducts = (products?.length ?? 0) > 0;
  const hasInventory = (inventory?.length ?? 0) > 0;
  const hasPurchases = (purchases?.length ?? 0) > 0;

  const completedSteps = useMemo(() => {
    let count = 0;
    if (hasStores) count++;
    if (hasProducts) count++;
    if (hasInventory) count++;
    if (hasPurchases) count++;
    return count;
  }, [hasStores, hasProducts, hasInventory, hasPurchases]);

  const totalSteps = 4;
  const isComplete = completedSteps === totalSteps;

  return {
    hasStores,
    hasProducts,
    hasInventory,
    hasPurchases,
    isComplete,
    completedSteps,
    totalSteps,
    wizardCompleted,
    storesCount: stores?.length ?? 0,
    productsCount: products?.length ?? 0,
    inventoryCount: inventory?.length ?? 0,
    purchasesCount: purchases?.length ?? 0,
  };
}
