import apiClient from './client';
import {
  Purchase,
  CreatePurchaseDto,
  UpdatePurchaseDto,
  PurchaseSummary,
  PriceHistory,
} from '../types/purchase.types';

export const purchasesApi = {
  getAll: async (): Promise<Purchase[]> => {
    const response = await apiClient.get<Purchase[]>('/purchases');
    return response.data;
  },

  getById: async (id: string): Promise<Purchase> => {
    const response = await apiClient.get<Purchase>(`/purchases/${id}`);
    return response.data;
  },

  create: async (data: CreatePurchaseDto): Promise<Purchase> => {
    const response = await apiClient.post<Purchase>('/purchases', data);
    return response.data;
  },

  update: async (id: string, data: UpdatePurchaseDto): Promise<Purchase> => {
    const response = await apiClient.put<Purchase>(`/purchases/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/purchases/${id}`);
  },

  getSummary: async (): Promise<PurchaseSummary> => {
    const response = await apiClient.get<PurchaseSummary>('/purchases/summary');
    return response.data;
  },

  getPriceHistory: async (productId: string): Promise<PriceHistory[]> => {
    const response = await apiClient.get<PriceHistory[]>(
      `/purchases/price-history/${productId}`,
    );
    return response.data;
  },

  export: async (from?: string, to?: string): Promise<Blob> => {
    const params = new URLSearchParams();
    if (from) params.append('from', from);
    if (to) params.append('to', to);
    const { data } = await apiClient.get('/purchases/export', {
      params,
      responseType: 'blob',
    });
    return data;
  },
};
