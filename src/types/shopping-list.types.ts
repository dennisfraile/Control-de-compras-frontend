import { Product } from './product.types';

export interface ShoppingListSuggestion {
  id: string;
  productId: string;
  product?: Product;
  reason: ShoppingReason;
  priority: ShoppingPriority;
  estimatedPrice?: number;
  lowestPriceStore?: string;
  lowestPrice?: number;
  suggestedQuantity: number;
  isChecked: boolean;
}

export enum ShoppingReason {
  LOW_STOCK = 'LOW_STOCK',
  OUT_OF_STOCK = 'OUT_OF_STOCK',
  SCHEDULED = 'SCHEDULED',
  EXPIRING_SOON = 'EXPIRING_SOON',
  MANUAL = 'MANUAL',
}

export const ShoppingReasonLabels: Record<ShoppingReason, string> = {
  [ShoppingReason.LOW_STOCK]: 'Stock bajo',
  [ShoppingReason.OUT_OF_STOCK]: 'Sin stock',
  [ShoppingReason.SCHEDULED]: 'Programado',
  [ShoppingReason.EXPIRING_SOON]: 'Por vencer',
  [ShoppingReason.MANUAL]: 'Manual',
};

export enum ShoppingPriority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export const ShoppingPriorityLabels: Record<ShoppingPriority, string> = {
  [ShoppingPriority.HIGH]: 'Alta',
  [ShoppingPriority.MEDIUM]: 'Media',
  [ShoppingPriority.LOW]: 'Baja',
};
