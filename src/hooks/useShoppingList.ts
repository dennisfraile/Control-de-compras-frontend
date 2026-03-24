import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSnackbar } from 'notistack';
import { shoppingListApi } from '../api/shopping-list.api';
import { QUERY_KEYS } from '../utils/constants';

export function useShoppingList() {
  return useQuery({
    queryKey: [QUERY_KEYS.shoppingList],
    queryFn: shoppingListApi.getSuggestions,
  });
}

// #22 - Optimistic updates for toggle
export function useToggleShoppingItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isChecked }: { id: string; isChecked: boolean }) =>
      shoppingListApi.toggleChecked(id, isChecked),
    onMutate: async ({ id, isChecked }) => {
      await queryClient.cancelQueries({ queryKey: [QUERY_KEYS.shoppingList] });
      const previous = queryClient.getQueryData([QUERY_KEYS.shoppingList]);
      queryClient.setQueryData<any[]>([QUERY_KEYS.shoppingList], (old) =>
        old?.map((item) => (item.productId === id || item.id === id ? { ...item, isChecked } : item))
      );
      return { previous };
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData([QUERY_KEYS.shoppingList], context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.shoppingList] });
    },
  });
}

export function useGenerateShoppingList() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: () => shoppingListApi.generateList(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.shoppingList] });
      enqueueSnackbar('Lista de compras generada', { variant: 'success' });
    },
    onError: () => {
      enqueueSnackbar('Error al generar la lista', { variant: 'error' });
    },
  });
}

export function useRemoveShoppingItem() {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: (id: string) => shoppingListApi.removeItem(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.shoppingList] });
      enqueueSnackbar('Item removido de la lista', { variant: 'info' });
    },
    onError: () => {
      enqueueSnackbar('Error al remover item', { variant: 'error' });
    },
  });
}
