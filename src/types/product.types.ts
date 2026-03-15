import { Category, UnitType } from '../utils/constants';

export interface Product {
  id: string;
  name: string;
  brand?: string;
  category: Category;
  defaultUnit: UnitType;
  defaultQuantity: number;
  purchaseFrequency?: string;
  notes?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: string;
  brand?: string;
  category: Category;
  defaultUnit: UnitType;
  defaultQuantity: number;
  purchaseFrequency?: string;
  notes?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}

export type { Category, UnitType };
