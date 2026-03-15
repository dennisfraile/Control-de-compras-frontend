import { Product } from './product.types';
import { Store } from './store.types';

export interface PurchaseItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Purchase {
  id: string;
  storeId: string;
  store?: Store;
  purchaseDate: string;
  totalAmount: number;
  notes?: string;
  items: PurchaseItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreatePurchaseItemDto {
  productId: string;
  quantity: number;
  unitPrice: number;
  notes?: string;
}

export interface CreatePurchaseDto {
  storeId: string;
  purchaseDate: string;
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
