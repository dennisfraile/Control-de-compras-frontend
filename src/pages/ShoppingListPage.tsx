import {
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Chip,
  Typography,
  IconButton,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import {
  useShoppingList,
  useToggleShoppingItem,
  useGenerateShoppingList,
  useRemoveShoppingItem,
} from '../hooks/useShoppingList';
import {
  ShoppingReason,
  ShoppingReasonLabels,
  ShoppingPriority,
  ShoppingPriorityLabels,
} from '../types/shopping-list.types';
import { formatCurrency } from '../utils/format';

const reasonColors: Record<ShoppingReason, 'error' | 'warning' | 'info' | 'default' | 'success'> = {
  [ShoppingReason.OUT_OF_STOCK]: 'error',
  [ShoppingReason.LOW_STOCK]: 'warning',
  [ShoppingReason.EXPIRING_SOON]: 'warning',
  [ShoppingReason.SCHEDULED]: 'info',
  [ShoppingReason.MANUAL]: 'default',
};

const priorityColors: Record<ShoppingPriority, 'error' | 'warning' | 'success'> = {
  [ShoppingPriority.HIGH]: 'error',
  [ShoppingPriority.MEDIUM]: 'warning',
  [ShoppingPriority.LOW]: 'success',
};

export default function ShoppingListPage() {
  const { data: items, isLoading } = useShoppingList();
  const toggleItem = useToggleShoppingItem();
  const generateList = useGenerateShoppingList();
  const removeItem = useRemoveShoppingItem();

  const handleToggle = (id: string, currentChecked: boolean) => {
    toggleItem.mutate({ id, isChecked: !currentChecked });
  };

  if (isLoading) return <LoadingSpinner />;

  const uncheckedItems = items?.filter((item) => !item.isChecked) ?? [];
  const checkedItems = items?.filter((item) => item.isChecked) ?? [];

  const estimatedTotal = uncheckedItems.reduce(
    (sum, item) => sum + (item.estimatedPrice ?? 0),
    0,
  );

  return (
    <Box>
      <PageHeader
        title="Lista de Compras"
        subtitle="Sugerencias inteligentes basadas en tu inventario"
      >
        <Button
          startIcon={<RefreshIcon />}
          variant="outlined"
          onClick={() => generateList.mutate()}
          disabled={generateList.isPending}
        >
          Regenerar Lista
        </Button>
      </PageHeader>

      {items && items.length > 0 ? (
        <>
          {estimatedTotal > 0 && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="body1">
                  Estimado total pendiente:{' '}
                  <strong>{formatCurrency(estimatedTotal)}</strong>
                </Typography>
              </CardContent>
            </Card>
          )}

          {uncheckedItems.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>
                Pendientes ({uncheckedItems.length})
              </Typography>
              <Card sx={{ mb: 3 }}>
                <List disablePadding>
                  {uncheckedItems.map((item) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton onClick={() => handleToggle(item.id, item.isChecked)} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={item.isChecked}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Box display="flex" alignItems="center" gap={1} sx={{ flexWrap: 'wrap' }}>
                              <Typography sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: { xs: 150, sm: 300, md: 'none' } }}>
                                {item.product?.name ?? 'Producto'} x{item.suggestedQuantity}
                              </Typography>
                              <Chip
                                label={ShoppingReasonLabels[item.reason]}
                                color={reasonColors[item.reason]}
                                size="small"
                              />
                              <Chip
                                label={ShoppingPriorityLabels[item.priority]}
                                color={priorityColors[item.priority]}
                                size="small"
                                variant="outlined"
                              />
                            </Box>
                          }
                          secondary={
                            item.lowestPrice
                              ? `Mejor precio: ${formatCurrency(item.lowestPrice)} en ${item.lowestPriceStore}`
                              : item.estimatedPrice
                                ? `Precio estimado: ${formatCurrency(item.estimatedPrice)}`
                                : undefined
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </>
          )}

          {checkedItems.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom color="text.secondary">
                Completados ({checkedItems.length})
              </Typography>
              <Card>
                <List disablePadding>
                  {checkedItems.map((item) => (
                    <ListItem
                      key={item.id}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeItem.mutate(item.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                      disablePadding
                    >
                      <ListItemButton onClick={() => handleToggle(item.id, item.isChecked)} dense>
                        <ListItemIcon>
                          <Checkbox
                            edge="start"
                            checked={item.isChecked}
                            tabIndex={-1}
                            disableRipple
                          />
                        </ListItemIcon>
                        <ListItemText
                          primary={
                            <Typography
                              sx={{ textDecoration: 'line-through', color: 'text.disabled' }}
                            >
                              {item.product?.name ?? 'Producto'} x{item.suggestedQuantity}
                            </Typography>
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Card>
            </>
          )}
        </>
      ) : (
        <EmptyState
          title="Lista vacia"
          description="Genera una lista de compras basada en tu inventario actual"
          action={
            <Button
              variant="contained"
              onClick={() => generateList.mutate()}
              disabled={generateList.isPending}
            >
              Generar Lista
            </Button>
          }
        />
      )}
    </Box>
  );
}
