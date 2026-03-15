import apiClient from './client';
import { ShoppingListSuggestion } from '../types/shopping-list.types';

export const shoppingListApi = {
  getSuggestions: async (): Promise<ShoppingListSuggestion[]> => {
    const response = await apiClient.get<ShoppingListSuggestion[]>(
      '/shopping-list',
    );
    return response.data;
  },

  toggleChecked: async (
    id: string,
    isChecked: boolean,
  ): Promise<ShoppingListSuggestion> => {
    const response = await apiClient.patch<ShoppingListSuggestion>(
      `/shopping-list/${id}/toggle`,
      { isChecked },
    );
    return response.data;
  },

  generateList: async (): Promise<ShoppingListSuggestion[]> => {
    const response = await apiClient.post<ShoppingListSuggestion[]>(
      '/shopping-list/generate',
    );
    return response.data;
  },

  removeItem: async (id: string): Promise<void> => {
    await apiClient.delete(`/shopping-list/${id}`);
  },
};
