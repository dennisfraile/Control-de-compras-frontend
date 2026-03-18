export interface ShoppingListSuggestion {
  productId: string;
  productName: string;
  suggestedQuantity: number;
  unitAbbreviation: string;
  currentStock: number;
  reason: string;
  lowestKnownPrice?: number;
  lowestPriceStore?: string;
  isChecked?: boolean;
}
