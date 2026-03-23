export interface Product {
  id: string;
  name: string;
  brand?: string;
  categoryId: number;
  categoryName?: string;
  defaultUnitTypeId: number;
  unitAbbreviation?: string;
  defaultQuantity: number;
  barcode?: string;
  imageUrl?: string;
  notes?: string;
  packageSize: number;
  packageLabel?: string;
  isGlobal?: boolean;
  createdAtUtc: string;
}

export interface CreateProductDto {
  name: string;
  brand?: string;
  categoryId: number;
  defaultUnitTypeId: number;
  defaultQuantity: number;
  barcode?: string;
  notes?: string;
  packageSize?: number;
  packageLabel?: string;
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
