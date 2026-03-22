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
}

export interface UpdateProductDto extends Partial<CreateProductDto> {}
