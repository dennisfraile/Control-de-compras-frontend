export interface Store {
  id: string;
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStoreDto {
  name: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  notes?: string;
}

export interface UpdateStoreDto extends Partial<CreateStoreDto> {}
