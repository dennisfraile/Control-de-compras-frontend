export interface PurchaseItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitTypeId: number;
  unitAbbreviation: string;
  unitPrice: number;
  totalPrice: number;
}

export interface Purchase {
  id: string;
  userId: string;
  storeId: string;
  storeName: string;
  purchaseDateUtc: string;
  totalAmount: number;
  notes?: string;
  createdAtUtc: string;
  items: PurchaseItem[];
}

export interface CreatePurchaseItemDto {
  productId: string;
  quantity: number;
  unitTypeId: number;
  unitPrice: number;
  addToInventory: boolean;
}

export interface CreatePurchaseDto {
  storeId: string;
  purchaseDateUtc: string;
  notes?: string;
  items: CreatePurchaseItemDto[];
}

export interface UpdatePurchaseDto extends Partial<CreatePurchaseDto> {}

export interface PriceHistory {
  date: string;
  price: number;
  storeName: string;
  storeId: string;
}

export interface PurchaseSummary {
  totalSpent: number;
  totalPurchases: number;
  averagePerPurchase: number;
  monthlySpending: MonthlySpending[];
}

export interface MonthlySpending {
  month: string;
  total: number;
}
