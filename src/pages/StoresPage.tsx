import { useState, lazy, Suspense } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Pencil, Trash2, Map, BarChart3 } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ResponsiveTable, { Column } from '../components/common/ResponsiveTable';
import StoreComparator from '../components/common/StoreComparator';
import { useStores, useCreateStore, useUpdateStore, useDeleteStore } from '../hooks/useStores';
import { usePurchases } from '../hooks/usePurchases';
import { Store, CreateStoreDto } from '../types/store.types';

const StoreMap = lazy(() => import('../components/common/StoreMap'));

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
  const [showMap, setShowMap] = useState(false);
  const [showComparator, setShowComparator] = useState(false);
  const { data: purchases } = usePurchases();

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

  const columns: Column<Store>[] = [
    {
      key: 'name',
      header: 'Nombre',
      align: 'left',
      render: (row) => row.name,
    },
    {
      key: 'address',
      header: 'Direccion',
      align: 'center',
      hideOnMobile: true,
      render: (row) => row.address ?? '-',
    },
    {
      key: 'city',
      header: 'Ciudad',
      align: 'center',
      hideOnMobile: true,
      render: (row) => row.city ?? '-',
    },
  ];

  const mobileCardRender = (store: Store) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {store.name}
          </div>
          {(store.address || store.city) && (
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {[store.address, store.city].filter(Boolean).join(' · ')}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          <button
            onClick={() => handleOpenEdit(store)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            title="Editar"
          >
            <Pencil size={18} className="text-blue-600" />
          </button>
          <button
            onClick={() => {
              setStoreToDelete(store.id);
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

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Tiendas"
        helpKey="stores"
        subtitle="Gestiona las tiendas donde realizas tus compras"
        actionLabel="Nueva tienda"
        onAction={handleOpenCreate}
      >
        <div className="flex gap-2">
          <Button
            variant="outlined"
            startIcon={<Map size={16} />}
            onClick={() => setShowMap(!showMap)}
            size="small"
          >
            {showMap ? 'Ocultar mapa' : 'Ver mapa'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<BarChart3 size={16} />}
            onClick={() => setShowComparator(!showComparator)}
            size="small"
          >
            Comparar
          </Button>
        </div>
      </PageHeader>

      {/* #19 - Store Map */}
      {showMap && stores && stores.length > 0 && (
        <div className="mb-6">
          <Suspense fallback={<div className="h-80 bg-gray-100 dark:bg-gray-700 rounded-xl animate-pulse" />}>
            <StoreMap stores={stores} />
          </Suspense>
        </div>
      )}

      {/* #5 - Store Comparator */}
      {showComparator && stores && stores.length >= 2 && purchases && (
        <div className="mb-6">
          <StoreComparator stores={stores} purchases={purchases} />
        </div>
      )}

      {stores && stores.length > 0 ? (
        <ResponsiveTable
          columns={columns}
          data={stores}
          keyExtractor={(s) => s.id}
          onEdit={handleOpenEdit}
          onDelete={(s) => {
            setStoreToDelete(s.id);
            setDeleteDialogOpen(true);
          }}
          mobileCardRender={mobileCardRender}
        />
      ) : (
        <EmptyState
          title="No hay tiendas"
          description="Agrega tu primera tienda para comenzar"
          action={
            <Button variant="contained" onClick={handleOpenCreate}>
              Agregar tienda
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingStore ? 'Editar tienda' : 'Nueva tienda'}
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
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
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
                  <TextField {...field} label="Sitio web" fullWidth />
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
        title="Eliminar tienda"
        message="Estas seguro de eliminar esta tienda? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setStoreToDelete(null);
        }}
        loading={deleteStore.isPending}
      />
      </div>
    </div>
  );
}
