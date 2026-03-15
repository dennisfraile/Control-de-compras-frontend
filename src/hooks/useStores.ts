import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { storesApi } from '../api/stores.api';
import { CreateStoreDto, UpdateStoreDto } from '../types/store.types';
import { QUERY_KEYS } from '../utils/constants';

export function useStores() {
  return useQuery({
    queryKey: [QUERY_KEYS.stores],
    queryFn: storesApi.getAll,
  });
}

export function useStore(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.stores, id],
    queryFn: () => storesApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateStore() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateStoreDto) => storesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.stores] });
      enqueueSnackbar('Tienda creada exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al crear la tienda', { variant: 'error' });
    },
  });
}

export function useUpdateStore() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateStoreDto }) =>
      storesApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.stores] });
      enqueueSnackbar('Tienda actualizada exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar la tienda', { variant: 'error' });
    },
  });
}

export function useDeleteStore() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => storesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.stores] });
      enqueueSnackbar('Tienda eliminada', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al eliminar la tienda', { variant: 'error' });
    },
  });
}
