import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
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
    const dto = {
      ...data,
      expirationDate: data.expirationDate || undefined,
    };

    if (editingEntry) {
      updateEntry.mutate(
        {
          id: editingEntry.id,
          data: {
            currentStock: dto.currentStock,
            minimumStock: dto.minimumStock,
            expirationDate: dto.expirationDate,
          },
        },
        { onSuccess: handleClose },
      );
    } else {
      createEntry.mutate(dto, { onSuccess: handleClose });
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

  const columns: GridColDef[] = [
    {
      field: 'productName',
      headerName: 'Producto',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: InventoryEntry) =>
        row.productName ? `${row.productName}${row.productBrand ? ` (${row.productBrand})` : ''}` : 'N/A',
    },
    {
      field: 'currentQuantity',
      headerName: 'Stock Actual',
      flex: 0.5,
      minWidth: 120,
      type: 'number',
      valueGetter: (_value: unknown, row: InventoryEntry) =>
        `${row.currentQuantity} ${row.unitAbbreviation ?? ''}`,
    },
    {
      field: 'minimumThreshold',
      headerName: 'Stock Minimo',
      flex: 0.5,
      minWidth: 120,
      type: 'number',
    },
    {
      field: 'estado',
      headerName: 'Estado',
      flex: 0.5,
      minWidth: 120,
      renderCell: (params) => {
        const row = params.row as InventoryEntry;
        const isLow = row.currentQuantity <= row.minimumThreshold;
        return isLow ? (
          <Chip label="Stock Bajo" color="error" size="small" />
        ) : (
          <Chip label="OK" color="success" size="small" />
        );
      },
    },
    {
      field: 'expirationDateUtc',
      headerName: 'Vencimiento',
      flex: 0.7,
      minWidth: 120,
      valueGetter: (_value: string | undefined, row: InventoryEntry) =>
        row.expirationDateUtc ? formatDate(row.expirationDateUtc) : 'N/A',
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleOpenEdit(params.row as InventoryEntry)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => {
            setEntryToDelete(params.row.id);
            setDeleteDialogOpen(true);
          }}
        />,
      ],
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader
        title="Inventario"
        subtitle="Control de stock de tus productos"
        actionLabel="Agregar al Inventario"
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
        <Box sx={{ height: { xs: 400, sm: 500, md: 600 }, width: '100%' }}>
          <DataGrid
            rows={inventory}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            columnVisibilityModel={{ expirationDate: !isMobile }}
            disableRowSelectionOnClick
            getRowClassName={(params) =>
              params.row.isLowStock ? 'low-stock-row' : ''
            }
            sx={{
              '& .low-stock-row': {
                bgcolor: 'rgba(239, 83, 80, 0.08)',
              },
            }}
          />
        </Box>
      ) : (
        <EmptyState
          title="Inventario vacio"
          description="Agrega productos a tu inventario para llevar el control de stock"
          action={
            <Button variant="contained" onClick={handleOpenCreate}>
              Agregar al Inventario
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingEntry ? 'Editar Inventario' : 'Agregar al Inventario'}
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
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Controller
                  name="currentStock"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Stock Actual"
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
                      label="Stock Minimo"
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
                    label="Fecha de Vencimiento"
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
        title="Eliminar del Inventario"
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
