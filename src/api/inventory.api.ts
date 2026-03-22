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
    const response = await apiClient.put<InventoryEntry>(
      `/inventory/${data.productId}`,
      { productId: data.productId, newQuantity: data.currentQuantity, unitTypeId: data.unitTypeId, minimumThreshold: data.minimumThreshold },
    );
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateInventoryEntryDto,
  ): Promise<InventoryEntry> => {
    const response = await apiClient.put<InventoryEntry>(
      `/inventory/${data.productId}`,
      { productId: data.productId, newQuantity: data.currentQuantity, unitTypeId: data.unitTypeId, minimumThreshold: data.minimumThreshold },
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

  export: async (): Promise<Blob> => {
    const { data } = await apiClient.get('/inventory/export', {
      responseType: 'blob',
    });
    return data;
  },
};

export const getRestockAlerts = () => apiClient.get('/inventory/restock-alerts').then(r => r.data);
export const getExpiringItems = (daysAhead = 7) => apiClient.get(`/inventory/expiring?daysAhead=${daysAhead}`).then(r => r.data);
