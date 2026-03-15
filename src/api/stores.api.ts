import apiClient from './client';
import { Store, CreateStoreDto, UpdateStoreDto } from '../types/store.types';

export const storesApi = {
  getAll: async (): Promise<Store[]> => {
    const response = await apiClient.get<Store[]>('/stores');
    return response.data;
  },

  getById: async (id: string): Promise<Store> => {
    const response = await apiClient.get<Store>(`/stores/${id}`);
    return response.data;
  },

  create: async (data: CreateStoreDto): Promise<Store> => {
    const response = await apiClient.post<Store>('/stores', data);
    return response.data;
  },

  update: async (id: string, data: UpdateStoreDto): Promise<Store> => {
    const response = await apiClient.put<Store>(`/stores/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/stores/${id}`);
  },
};
