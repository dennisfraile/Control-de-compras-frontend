import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from '../hooks/useStores';
import { Store, CreateStoreDto } from '../types/store.types';

const storeSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  address: z.string().optional(),
  city: z.string().optional(),
  phone: z.string().optional(),
  website: z.string().optional(),
  notes: z.string().optional(),
});

type StoreFormData = z.infer<typeof storeSchema>;

export default function StoresPage() {
  const { data: stores, isLoading } = useStores();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();
  const deleteStore = useDeleteStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [storeToDelete, setStoreToDelete] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<StoreFormData>({
    resolver: zodResolver(storeSchema),
    defaultValues: {
      name: '',
      address: '',
      city: '',
      phone: '',
      website: '',
      notes: '',
    },
  });

  const handleOpenCreate = () => {
    reset({ name: '', address: '', city: '', phone: '', website: '', notes: '' });
    setEditingStore(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (store: Store) => {
    reset({
      name: store.name,
      address: store.address ?? '',
      city: store.city ?? '',
      phone: store.phone ?? '',
      website: store.website ?? '',
      notes: store.notes ?? '',
    });
    setEditingStore(store);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingStore(null);
  };

  const onSubmit = (data: StoreFormData) => {
    const dto: CreateStoreDto = {
      name: data.name,
      address: data.address || undefined,
      city: data.city || undefined,
      phone: data.phone || undefined,
      website: data.website || undefined,
      notes: data.notes || undefined,
    };

    if (editingStore) {
      updateStore.mutate(
        { id: editingStore.id, data: dto },
        { onSuccess: handleClose },
      );
    } else {
      createStore.mutate(dto, { onSuccess: handleClose });
    }
  };

  const handleDeleteConfirm = () => {
    if (storeToDelete) {
      deleteStore.mutate(storeToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setStoreToDelete(null);
        },
      });
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'address', headerName: 'Direccion', flex: 1, minWidth: 200 },
    { field: 'city', headerName: 'Ciudad', flex: 0.7, minWidth: 120 },
    { field: 'phone', headerName: 'Telefono', flex: 0.7, minWidth: 120 },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleOpenEdit(params.row as Store)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => {
            setStoreToDelete(params.row.id);
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
        title="Tiendas"
        subtitle="Gestiona las tiendas donde realizas tus compras"
        actionLabel="Nueva Tienda"
        onAction={handleOpenCreate}
      />

      {stores && stores.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={stores}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <EmptyState
          title="No hay tiendas"
          description="Agrega tu primera tienda para comenzar"
          action={
            <Button variant="contained" onClick={handleOpenCreate}>
              Agregar Tienda
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingStore ? 'Editar Tienda' : 'Nueva Tienda'}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Nombre"
                    error={!!errors.name}
                    helperText={errors.name?.message}
                    fullWidth
                  />
                )}
              />
              <Controller
                name="address"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Direccion" fullWidth />
                )}
              />
              <Box display="flex" gap={2}>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Ciudad" fullWidth />
                  )}
                />
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} label="Telefono" fullWidth />
                  )}
                />
              </Box>
              <Controller
                name="website"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Sitio Web" fullWidth />
                )}
              />
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas"
                    multiline
                    rows={2}
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
              disabled={createStore.isPending || updateStore.isPending}
            >
              {editingStore ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Tienda"
        message="Estas seguro de eliminar esta tienda? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setStoreToDelete(null);
        }}
        loading={deleteStore.isPending}
      />
    </Box>
  );
}
