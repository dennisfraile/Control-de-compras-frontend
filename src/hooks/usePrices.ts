import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { pricesApi } from '../api/prices.api';
import { PriceHistoryQuery, CreatePriceSuggestionDto } from '../types/price.types';
import { QUERY_KEYS } from '../utils/constants';

export function useBestDeals() {
  return useQuery({
    queryKey: [QUERY_KEYS.prices, 'best-deals'],
    queryFn: pricesApi.getBestDeals,
  });
}

export function usePriceHistory(query: PriceHistoryQuery) {
  return useQuery({
    queryKey: [QUERY_KEYS.prices, 'history', query],
    queryFn: () => pricesApi.getPriceHistory(query),
    enabled: !!query.productId,
  });
}

export function useCommunityPrices() {
  return useQuery({
    queryKey: [QUERY_KEYS.prices, 'community'],
    queryFn: pricesApi.getCommunityPrices,
  });
}

export function useSubmitPrice() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreatePriceSuggestionDto) => pricesApi.submitPrice(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.prices] });
      enqueueSnackbar('Precio reportado exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al reportar precio', { variant: 'error' });
    },
  });
}
