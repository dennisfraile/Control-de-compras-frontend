export interface PriceSuggestion {
  id: string;
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  price: number;
  reportedAt: string;
  reportedBy?: string;
}

export interface BestDeal {
  productId: string;
  productName: string;
  storeId: string;
  storeName: string;
  price: number;
  lastUpdated: string;
  priceChange?: number;
}

export interface PriceHistoryQuery {
  productId: string;
  storeId?: string;
  startDate?: string;
  endDate?: string;
}

export interface PricePoint {
  date: string;
  price: number;
  storeName: string;
  storeId: string;
}

export interface CreatePriceSuggestionDto {
  productId: string;
  storeId: string;
  price: number;
}
