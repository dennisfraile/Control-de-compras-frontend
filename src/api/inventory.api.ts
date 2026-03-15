import apiClient from './client';
import {
  InventoryEntry,
  CreateInventoryEntryDto,
  UpdateInventoryEntryDto,
} from '../types/inventory.types';

export const inventoryApi = {
  getAll: async (): Promise<InventoryEntry[]> => {
    const response = await apiClient.get<InventoryEntry[]>('/inventory');
    return response.data;
  },

  getById: async (id: string): Promise<InventoryEntry> => {
    const response = await apiClient.get<InventoryEntry>(`/inventory/${id}`);
    return response.data;
  },

  create: async (data: CreateInventoryEntryDto): Promise<InventoryEntry> => {
    const response = await apiClient.post<InventoryEntry>('/inventory', data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateInventoryEntryDto,
  ): Promise<InventoryEntry> => {
    const response = await apiClient.put<InventoryEntry>(
      `/inventory/${id}`,
      data,
    );
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/inventory/${id}`);
  },

  getLowStock: async (): Promise<InventoryEntry[]> => {
    const response = await apiClient.get<InventoryEntry[]>('/inventory/low-stock');
    return response.data;
  },
};
