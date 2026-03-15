import { Product } from './product.types';

export interface InventoryEntry {
  id: string;
  productId: string;
  product?: Product;
  currentStock: number;
  minimumStock: number;
  lastRestocked?: string;
  expirationDate?: string;
  isLowStock: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInventoryEntryDto {
  productId: string;
  currentStock: number;
  minimumStock: number;
  expirationDate?: string;
}

export interface UpdateInventoryEntryDto {
  currentStock?: number;
  minimumStock?: number;
  expirationDate?: string;
}
