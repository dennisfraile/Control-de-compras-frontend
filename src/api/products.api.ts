import apiClient from './client';
import { Product, CreateProductDto, UpdateProductDto } from '../types/product.types';

export const productsApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await apiClient.get<Product[]>('/products');
    return response.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response.data;
  },

  create: async (data: CreateProductDto): Promise<Product> => {
    const response = await apiClient.post<Product>('/products', data);
    return response.data;
  },

  update: async (id: string, data: UpdateProductDto): Promise<Product> => {
    const response = await apiClient.put<Product>(`/products/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};

export const toggleFavorite = (id: string) => apiClient.post(`/products/${id}/toggle-favorite`).then(r => r.data);
export const getFavorites = () => apiClient.get('/products/favorites').then(r => r.data);
