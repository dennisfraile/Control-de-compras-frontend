import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { productsApi } from '../api/products.api';
import { CreateProductDto, UpdateProductDto } from '../types/product.types';
import { QUERY_KEYS } from '../utils/constants';

export function useProducts() {
  return useQuery({
    queryKey: [QUERY_KEYS.products],
    queryFn: productsApi.getAll,
  });
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.products, id],
    queryFn: () => productsApi.getById(id),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (data: CreateProductDto) => productsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
      enqueueSnackbar('Producto creado exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al crear el producto', { variant: 'error' });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateProductDto }) =>
      productsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
      enqueueSnackbar('Producto actualizado exitosamente', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al actualizar el producto', { variant: 'error' });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => productsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.products] });
      enqueueSnackbar('Producto eliminado', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al eliminar el producto', { variant: 'error' });
    },
  });
}
