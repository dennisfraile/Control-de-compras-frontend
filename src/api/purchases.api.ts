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
    const response = await apiClient.get<
      { year: number; month: number; totalSpent: number; totalPurchases: number }[]
    >('/purchases/summary');
    const data = response.data;
    const totalSpent = data.reduce((sum, d) => sum + d.totalSpent, 0);
    const totalPurchases = data.reduce((sum, d) => sum + d.totalPurchases, 0);
    const monthlySpending = data.map((d) => ({
      month: `${d.year}-${String(d.month).padStart(2, '0')}`,
      total: d.totalSpent,
    }));
    return {
      totalSpent,
      totalPurchases,
      averagePerPurchase: totalPurchases > 0 ? totalSpent / totalPurchases : 0,
      monthlySpending,
    };
  },

  getPriceHistory: async (productId: string): Promise<PriceHistory[]> => {
    const response = await apiClient.get<PriceHistory[]>(
      `/purchases/price-history/${productId}`,
    );
    return response.data;
  },

  quickPurchase: async (data: { storeId: string; items: Array<{ productId: string; quantity: number; unitTypeId: number; unitPrice: number }> }) => {
    const { data: result } = await apiClient.post('/purchases/quick', data);
    return result;
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

export interface PurchaseCalendarDay {
  date: string;
  purchaseCount: number;
  totalSpent: number;
  storeNames: string[];
}

export const getCalendar = async (year: number, month: number): Promise<PurchaseCalendarDay[]> => {
  const { data } = await apiClient.get<PurchaseCalendarDay[]>('/purchases/calendar', {
    params: { year, month },
  });
  return data;
};

export const scanReceipt = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  return apiClient.post('/purchases/scan-receipt', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then(r => r.data);
};
