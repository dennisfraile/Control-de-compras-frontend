import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Minus, Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import StockLevelIndicator from '../components/common/StockLevelIndicator';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import DependencyBanner from '../components/onboarding/DependencyBanner';
import ResponsiveTable, { Column } from '../components/common/ResponsiveTable';
import {
  useInventory,
  useCreateInventoryEntry,
  useUpdateInventoryEntry,
  useDeleteInventoryEntry,
} from '../hooks/useInventory';
import { useProducts } from '../hooks/useProducts';
import { inventoryApi } from '../api/inventory.api';
import { InventoryEntry } from '../types/inventory.types';
import { formatDate, formatStock, formatUnit } from '../utils/format';

const inventorySchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  currentStock: z.coerce.number().min(0, 'Stock no puede ser negativo'),
  minimumStock: z.coerce.number().min(0, 'El minimo no puede ser negativo'),
  expirationDate: z.string().optional(),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

export default function InventoryPage() {
  const { data: inventory, isLoading } = useInventory();
  const { data: products } = useProducts();
  const createEntry = useCreateInventoryEntry();
  const updateEntry = useUpdateInventoryEntry();
  const deleteEntry = useDeleteInventoryEntry();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<InventoryEntry | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await inventoryApi.export();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'inventario.xlsx';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      // Error handled silently
    } finally {
      setExporting(false);
    }
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      productId: '',
      currentStock: 0,
      minimumStock: 0,
      expirationDate: '',
    },
  });

  const handleOpenCreate = () => {
    reset({ productId: '', currentStock: 0, minimumStock: 0, expirationDate: '' });
    setEditingEntry(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (entry: InventoryEntry) => {
    reset({
      productId: entry.productId,
      currentStock: entry.currentQuantity,
      minimumStock: entry.minimumThreshold,
      expirationDate: entry.expirationDateUtc ? entry.expirationDateUtc.split('T')[0] : '',
    });
    setEditingEntry(entry);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingEntry(null);
  };

  const onSubmit = (data: InventoryFormData) => {
    const expirationUtc = data.expirationDate
      ? new Date(data.expirationDate + 'T00:00:00Z').toISOString()
      : undefined;

    if (editingEntry) {
      updateEntry.mutate(
        {
          id: editingEntry.id,
          data: {
            productId: data.productId,
            currentQuantity: data.currentStock,
            unitTypeId: editingEntry.unitTypeId ?? 5,
            minimumThreshold: data.minimumStock,
            expirationDateUtc: expirationUtc,
          },
        },
        { onSuccess: handleClose },
      );
    } else {
      createEntry.mutate(
        {
          productId: data.productId,
          currentQuantity: data.currentStock,
          unitTypeId: 5,
          minimumThreshold: data.minimumStock,
          expirationDateUtc: expirationUtc,
        },
        { onSuccess: handleClose },
      );
    }
  };

  const handleDeleteConfirm = () => {
    if (entryToDelete) {
      deleteEntry.mutate(entryToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setEntryToDelete(null);
        },
      });
    }
  };

  const getStatusBadge = (row: InventoryEntry) => {
    const isLow = row.currentQuantity <= row.minimumThreshold;
    if (isLow) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
          Stock bajo
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
        OK
      </span>
    );
  };

  const queryClient = useQueryClient();

  const handleQuickAdjust = async (entry: InventoryEntry, delta: number) => {
    const newQty = Math.max(0, entry.currentQuantity + delta);
    try {
      if (delta < 0) {
        await inventoryApi.quickConsume(entry.productId, Math.abs(delta));
      } else {
        await inventoryApi.update(entry.id, {
          ...entry,
          currentQuantity: newQty,
        });
      }
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      const label = delta > 0 ? `+${delta}` : `${delta}`;
      toast.success(`${entry.productName}: ${label}`);
    } catch {
      toast.error('Error al actualizar');
    }
  };

  const FractionButtons = ({ entry }: { entry: InventoryEntry }) => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleQuickAdjust(entry, -0.25)}
        className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
        title="Quitar 1/4"
      >
        -¼
      </button>
      <button
        onClick={() => handleQuickAdjust(entry, -0.5)}
        className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center justify-center"
        title="Quitar 1/2"
      >
        -½
      </button>
      <button
        onClick={() => handleQuickAdjust(entry, 0.5)}
        className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center justify-center"
        title="Agregar 1/2"
      >
        +½
      </button>
      <button
        onClick={() => handleQuickAdjust(entry, 0.25)}
        className="w-8 h-8 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 text-xs font-bold hover:bg-green-100 dark:hover:bg-green-900/40 transition-colors flex items-center justify-center"
        title="Agregar 1/4"
      >
        +¼
      </button>
      <button
        onClick={() => handleQuickAdjust(entry, -1)}
        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
        title="Quitar 1 empaque"
      >
        <Minus size={14} />
      </button>
      <button
        onClick={() => handleQuickAdjust(entry, 1)}
        className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
        title="Agregar 1 empaque"
      >
        <Plus size={14} />
      </button>
    </div>
  );

  const LevelBar = ({ current, minimum }: { current: number; minimum: number }) => {
    const fraction = current % 1;
    const percent = minimum > 0 ? Math.min((current / minimum) * 100, 100) : (current > 0 ? 100 : 0);
    const color = percent <= 25 ? 'bg-red-500' : percent <= 50 ? 'bg-yellow-500' : 'bg-green-500';
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-1">
        <div className={`h-2 rounded-full ${color} transition-all`} style={{ width: `${percent}%` }} />
      </div>
    );
  };

  const columns: Column<InventoryEntry>[] = [
    {
      key: 'productName',
      header: 'Producto',
      align: 'left',
      render: (row) =>
        row.productName
          ? `${row.productName}${row.productBrand ? ` (${row.productBrand})` : ''}`
          : 'N/A',
    },
    {
      key: 'currentQuantity',
      header: 'Stock actual',
      align: 'center',
      render: (row) => (
        <div className="flex flex-col items-center gap-2 py-1">
          <StockLevelIndicator quantity={row.currentQuantity} unitAbbreviation={formatUnit(row.currentQuantity, row.unitAbbreviation ?? '')} />
          <FractionButtons entry={row} />
        </div>
      ),
    },
    {
      key: 'minimumThreshold',
      header: 'Minimo',
      align: 'center',
      hideOnMobile: true,
      render: (row) => row.minimumThreshold,
    },
    {
      key: 'estado',
      header: 'Estado',
      align: 'center',
      render: (row) => getStatusBadge(row),
    },
    {
      key: 'expirationDateUtc',
      header: 'Vencimiento',
      align: 'center',
      render: (row) => row.expirationDateUtc ? formatDate(row.expirationDateUtc) : 'Sin vencimiento',
    },
  ];

  const mobileCardRender = (entry: InventoryEntry) => {
    const isLow = entry.currentQuantity <= entry.minimumThreshold;
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {entry.productName ?? 'N/A'}
            </div>
            <div className="flex items-center gap-2 mt-1">
              {isLow ? (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300">
                  Stock bajo
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                  OK
                </span>
              )}
            </div>
            <div className="mt-2">
              <StockLevelIndicator quantity={entry.currentQuantity} unitAbbreviation={formatUnit(entry.currentQuantity, entry.unitAbbreviation ?? '')} compact />
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              type="button"
              onClick={() => handleOpenEdit(entry)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Editar"
            >
              <Pencil size={18} className="text-blue-600" />
            </button>
            <button
              type="button"
              onClick={() => {
                setEntryToDelete(entry.id);
                setDeleteDialogOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Eliminar"
            >
              <Trash2 size={18} className="text-red-600" />
            </button>
          </div>
        </div>
        <div className="mt-3">
          <FractionButtons entry={entry} />
        </div>
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  const hasProducts = (products?.length ?? 0) > 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <DependencyBanner
        show={!hasProducts}
        message="Agrega productos primero para poder registrar tu inventario."
        actionLabel="Ir a productos"
        actionPath="/products"
      />

      <PageHeader
        title="Inventario"
        helpKey="inventory"
        subtitle="Control de stock de tus productos"
        actionLabel="Agregar al inventario"
        onAction={handleOpenCreate}
      >
        <Button
          variant="outlined"
          startIcon={<FileDownloadIcon />}
          onClick={handleExport}
          disabled={exporting}
        >
          Exportar Excel
        </Button>
      </PageHeader>

      {inventory && inventory.length > 0 ? (
        <ResponsiveTable
          columns={columns}
          data={inventory}
          keyExtractor={(e) => e.id}
          onEdit={handleOpenEdit}
          onDelete={(e) => {
            setEntryToDelete(e.id);
            setDeleteDialogOpen(true);
          }}
          mobileCardRender={mobileCardRender}
        />
      ) : (
        <EmptyState
          title="Inventario vacio"
          description="Agrega productos a tu inventario para llevar el control de stock"
          action={
            <Button variant="contained" onClick={handleOpenCreate}>
              Agregar al inventario
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingEntry ? 'Editar inventario' : 'Agregar al inventario'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Controller
                name="productId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Producto"
                    error={!!errors.productId}
                    helperText={errors.productId?.message}
                    fullWidth
                    disabled={!!editingEntry}
                  >
                    {products?.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        {p.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, '& > *': { width: '100%' } }}>
                <Controller
                  name="currentStock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Stock actual"
                      error={!!errors.currentStock}
                      helperText={errors.currentStock?.message}
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="minimumStock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Avisar cuando tenga menos de"
                      error={!!errors.minimumStock}
                      helperText={errors.minimumStock?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
              <Controller
                name="expirationDate"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="date"
                    label="Fecha de vencimiento"
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                  />
                )}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createEntry.isPending || updateEntry.isPending}
            >
              {editingEntry ? 'Actualizar' : 'Agregar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar del inventario"
        message="Estas seguro de eliminar esta entrada del inventario?"
        confirmLabel="Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setEntryToDelete(null);
        }}
        loading={deleteEntry.isPending}
      />
      </div>
    </div>
  );
}
