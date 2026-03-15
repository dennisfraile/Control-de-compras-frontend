import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { inventoryApi } from '../api/inventory.api';
import {
  CreateInventoryEntryDto,
  UpdateInventoryEntryDto,
} from '../types/inventory.types';
import { QUERY_KEYS } from '../utils/constants';

export function useInventory() {
  return useQuery({
    queryKey: [QUERY_KEYS.inventory],
    queryFn: inventoryApi.getAll,
  });
}

export function useInventoryEntry(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.inventory, id],
    queryFn: () => inventoryApi.getById(id),
    enabled: !!id,
  });
}

export function useLowStock() {
  return useQuery({
    queryKey: [QUERY_KEYS.inventory, 'low-stock'],
    queryFn: inventoryApi.getLowStock,
  });
}

export function useCreateInventoryEntry() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateInventoryEntryDto) => inventoryApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      enqueueSnackbar('Entrada de inventario creada', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al crear entrada de inventario', {
        variant: 'error',
      });
    },
  });
}

export function useUpdateInventoryEntry() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: UpdateInventoryEntryDto;
    }) => inventoryApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      enqueueSnackbar('Inventario actualizado', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar inventario', { variant: 'error' });
    },
  });
}

export function useDeleteInventoryEntry() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => inventoryApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.inventory] });
      enqueueSnackbar('Entrada de inventario eliminada', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al eliminar entrada de inventario', {
        variant: 'error',
      });
    },
  });
}
