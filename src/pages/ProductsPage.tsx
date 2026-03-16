import { useState } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Product, CreateProductDto } from '../types/product.types';
import { Category, UnitType, CategoryLabels, UnitTypeLabels } from '../utils/constants';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  brand: z.string().optional(),
  category: z.nativeEnum(Category, { errorMap: () => ({ message: 'Selecciona una categoria' }) }),
  defaultUnit: z.nativeEnum(UnitType, { errorMap: () => ({ message: 'Selecciona una unidad' }) }),
  defaultQuantity: z.coerce.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  purchaseFrequency: z.string().optional(),
  notes: z.string().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      category: Category.OTROS,
      defaultUnit: UnitType.UNIDAD,
      defaultQuantity: 1,
      purchaseFrequency: '',
      notes: '',
    },
  });

  const handleOpenCreate = () => {
    reset({
      name: '',
      brand: '',
      category: Category.OTROS,
      defaultUnit: UnitType.UNIDAD,
      defaultQuantity: 1,
      purchaseFrequency: '',
      notes: '',
    });
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    reset({
      name: product.name,
      brand: product.brand ?? '',
      category: product.category,
      defaultUnit: product.defaultUnit,
      defaultQuantity: product.defaultQuantity,
      purchaseFrequency: product.purchaseFrequency ?? '',
      notes: product.notes ?? '',
    });
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const onSubmit = (data: ProductFormData) => {
    const dto: CreateProductDto = {
      ...data,
      brand: data.brand || undefined,
      purchaseFrequency: data.purchaseFrequency || undefined,
      notes: data.notes || undefined,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, data: dto },
        { onSuccess: handleClose },
      );
    } else {
      createProduct.mutate(dto, { onSuccess: handleClose });
    }
  };

  const handleDeleteConfirm = () => {
    if (productToDelete) {
      deleteProduct.mutate(productToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        },
      });
    }
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Nombre', flex: 1, minWidth: 150 },
    { field: 'brand', headerName: 'Marca', flex: 0.7, minWidth: 100 },
    {
      field: 'category',
      headerName: 'Categoria',
      flex: 0.7,
      minWidth: 120,
      valueGetter: (_value: Category, row: Product) => CategoryLabels[row.category] ?? row.category,
    },
    {
      field: 'defaultUnit',
      headerName: 'Unidad',
      flex: 0.5,
      minWidth: 100,
      valueGetter: (_value: UnitType, row: Product) => UnitTypeLabels[row.defaultUnit] ?? row.defaultUnit,
    },
    { field: 'defaultQuantity', headerName: 'Cantidad', flex: 0.5, minWidth: 80, type: 'number' },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 100,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => handleOpenEdit(params.row as Product)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => {
            setProductToDelete(params.row.id);
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
        title="Productos"
        subtitle="Gestiona tu catalogo de productos"
        actionLabel="Nuevo Producto"
        onAction={handleOpenCreate}
      />

      {products && products.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={products}
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
          title="No hay productos"
          description="Agrega tu primer producto para comenzar"
          action={
            <Button variant="contained" onClick={handleOpenCreate}>
              Agregar Producto
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
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
                name="brand"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Marca" fullWidth />
                )}
              />
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Categoria"
                    error={!!errors.category}
                    helperText={errors.category?.message}
                    fullWidth
                  >
                    {Object.entries(CategoryLabels).map(([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Box display="flex" gap={2}>
                <Controller
                  name="defaultUnit"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Unidad"
                      error={!!errors.defaultUnit}
                      helperText={errors.defaultUnit?.message}
                      fullWidth
                    >
                      {Object.entries(UnitTypeLabels).map(([value, label]) => (
                        <MenuItem key={value} value={value}>
                          {label}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Controller
                  name="defaultQuantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Cantidad"
                      error={!!errors.defaultQuantity}
                      helperText={errors.defaultQuantity?.message}
                      fullWidth
                    />
                  )}
                />
              </Box>
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
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Producto"
        message="Estas seguro de eliminar este producto? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        loading={deleteProduct.isPending}
      />
    </Box>
  );
}
