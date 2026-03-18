export interface InventoryEntry {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  productBrand?: string;
  currentQuantity: number;
  unitTypeId: number;
  unitAbbreviation: string;
  minimumThreshold: number;
  lastUpdatedUtc: string;
  expirationDateUtc?: string;
  // computed helpers for UI
  product?: { name: string; brand?: string };
  currentStock?: number;
  minimumStock?: number;
  isLowStock?: boolean;
}

export interface CreateInventoryEntryDto {
  productId: string;
  currentQuantity: number;
  unitTypeId: number;
  minimumThreshold: number;
  expirationDateUtc?: string;
}

export interface UpdateInventoryEntryDto {
  productId: string;
  currentQuantity: number;
  unitTypeId: number;
  minimumThreshold: number;
  expirationDateUtc?: string;
}
