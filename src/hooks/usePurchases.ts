import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { purchasesApi } from '../api/purchases.api';
import { CreatePurchaseDto, UpdatePurchaseDto } from '../types/purchase.types';
import { QUERY_KEYS } from '../utils/constants';

export function usePurchases() {
  return useQuery({
    queryKey: [QUERY_KEYS.purchases],
    queryFn: purchasesApi.getAll,
  });
}

export function usePurchase(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.purchases, id],
    queryFn: () => purchasesApi.getById(id),
    enabled: !!id,
  });
}

export function usePurchaseSummary() {
  return useQuery({
    queryKey: [QUERY_KEYS.purchases, 'summary'],
    queryFn: purchasesApi.getSummary,
  });
}

export function usePriceHistory(productId: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.purchases, 'price-history', productId],
    queryFn: () => purchasesApi.getPriceHistory(productId),
    enabled: !!productId,
  });
}

export function useCreatePurchase() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreatePurchaseDto) => purchasesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.purchases] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      enqueueSnackbar('Compra registrada exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al registrar la compra', { variant: 'error' });
    },
  });
}

export function useUpdatePurchase() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePurchaseDto }) =>
      purchasesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.purchases] });
      enqueueSnackbar('Compra actualizada exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar la compra', { variant: 'error' });
    },
  });
}

export function useDeletePurchase() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => purchasesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.purchases] });
      enqueueSnackbar('Compra eliminada', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al eliminar la compra', { variant: 'error' });
    },
  });
}
