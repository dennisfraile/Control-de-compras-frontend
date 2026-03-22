import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2 } from 'lucide-react';
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
import { formatDate } from '../utils/format';

const inventorySchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  currentStock: z.coerce.number().min(0, 'Stock no puede ser negativo'),
  minimumStock: z.coerce.number().min(0, 'Stock minimo no puede ser negativo'),
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
    if (editingEntry) {
      updateEntry.mutate(
        {
          id: editingEntry.id,
          data: {
            productId: data.productId,
            currentQuantity: data.currentStock,
            unitTypeId: editingEntry.unitTypeId ?? 5,
            minimumThreshold: data.minimumStock,
            expirationDateUtc: data.expirationDate || undefined,
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
          expirationDateUtc: data.expirationDate || undefined,
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
      render: (row) => `${row.currentQuantity} ${row.unitAbbreviation ?? ''}`,
    },
    {
      key: 'minimumThreshold',
      header: 'Stock minimo',
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
      hideOnMobile: true,
      render: (row) => row.expirationDateUtc ? formatDate(row.expirationDateUtc) : 'N/A',
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
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-2">
              <span>{entry.currentQuantity} {entry.unitAbbreviation ?? ''}</span>
              <span>·</span>
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
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              onClick={() => handleOpenEdit(entry)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Editar"
            >
              <Pencil size={18} className="text-blue-600" />
            </button>
            <button
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
      </div>
    );
  };

  if (isLoading) return <LoadingSpinner />;

  const hasProducts = (products?.length ?? 0) > 0;

  return (
    <Box>
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
                      label="Stock minimo"
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
    </Box>
  );
}
