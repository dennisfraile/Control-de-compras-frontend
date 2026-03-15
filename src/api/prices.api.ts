import apiClient from './client';
import {
  PriceSuggestion,
  BestDeal,
  PricePoint,
  PriceHistoryQuery,
  CreatePriceSuggestionDto,
} from '../types/price.types';

export const pricesApi = {
  getBestDeals: async (): Promise<BestDeal[]> => {
    const response = await apiClient.get<BestDeal[]>('/prices/best-deals');
    return response.data;
  },

  getPriceHistory: async (query: PriceHistoryQuery): Promise<PricePoint[]> => {
    const response = await apiClient.get<PricePoint[]>('/prices/history', {
      params: query,
    });
    return response.data;
  },

  getCommunityPrices: async (): Promise<PriceSuggestion[]> => {
    const response = await apiClient.get<PriceSuggestion[]>('/prices/community');
    return response.data;
  },

  submitPrice: async (
    data: CreatePriceSuggestionDto,
  ): Promise<PriceSuggestion> => {
    const response = await apiClient.post<PriceSuggestion>('/prices', data);
    return response.data;
  },
};
