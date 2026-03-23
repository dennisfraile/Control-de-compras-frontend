import { useState, useRef } from 'react';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Tooltip, Autocomplete, createFilterOptions } from '@mui/material';
import { Pencil, Trash2, Search } from 'lucide-react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSnackbar } from 'notistack';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import ResponsiveTable, { Column } from '../components/common/ResponsiveTable';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../hooks/useProducts';
import { Product, CreateProductDto } from '../types/product.types';
// Constants imported if needed elsewhere

// Fallback categories if API hasn't loaded
const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Lácteos' }, { id: 2, name: 'Carnes' }, { id: 3, name: 'Frutas y verduras' },
  { id: 4, name: 'Cereales y granos' }, { id: 5, name: 'Bebidas' }, { id: 6, name: 'Limpieza' },
  { id: 7, name: 'Higiene personal' }, { id: 8, name: 'Enlatados' }, { id: 9, name: 'Condimentos' },
  { id: 10, name: 'Panadería' },
];

const brandFilter = createFilterOptions<string>({
  ignoreCase: true,
  ignoreAccents: true,
  trim: true,
});

const UNIT_TYPES = [
  { id: 1, name: 'Mililitros (ml)' },
  { id: 2, name: 'Litros (L)' },
  { id: 3, name: 'Gramos (g)' },
  { id: 4, name: 'Kilogramos (kg)' },
  { id: 5, name: 'Unidad' },
  { id: 6, name: 'Pieza' },
];
import apiClient from '../api/client';

const productSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  brand: z.string().optional(),
  categoryId: z.coerce.number().min(1, 'Selecciona una categoria'),
  defaultUnitTypeId: z.coerce.number().min(1, 'Selecciona una unidad'),
  defaultQuantity: z.coerce.number().min(0.01, 'La cantidad debe ser mayor a 0'),
  notes: z.string().optional(),
  barcode: z.string().optional(),
  packageLabel: z.string().optional(),
  packageSize: z.coerce.number().optional(),
});

type ProductFormData = z.infer<typeof productSchema>;

export default function ProductsPage() {
  const { data: products, isLoading } = useProducts();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  // Extract existing brands for autocomplete
  const existingBrands = Array.from(
    new Set((products ?? []).map((p) => p.brand).filter((b): b is string => !!b))
  ).sort();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [barcodeSearch, setBarcodeSearch] = useState('');
  const [newCategoryDialogOpen, setNewCategoryDialogOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [creatingCategory, setCreatingCategory] = useState(false);
  const queryClient = useQueryClient();

  // Load categories from API
  const { data: apiCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: () => apiClient.get('/categories').then(r => r.data as Array<{ id: number; name: string }>),
  });
  const CATEGORIES = apiCategories ?? FALLBACK_CATEGORIES;
  const [highlightedProductId, setHighlightedProductId] = useState<string | null>(null);
  const [barcodeSearchOpen, setBarcodeSearchOpen] = useState(false);
  const highlightRef = useRef<HTMLDivElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      brand: '',
      categoryId: 9,
      defaultUnitTypeId: 5,
      defaultQuantity: 1,
      notes: '',
      barcode: '',
      packageLabel: '',
      packageSize: 1,
    },
  });

  const handleBarcodeSearch = async () => {
    if (!barcodeSearch.trim()) return;
    try {
      const response = await apiClient.get<Product>(`/products/by-barcode/${encodeURIComponent(barcodeSearch.trim())}`);
      const found = response.data;
      setHighlightedProductId(found.id);
      setTimeout(() => {
        highlightRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
      setTimeout(() => setHighlightedProductId(null), 3000);
    } catch {
      enqueueSnackbar('Producto no encontrado con ese codigo', { variant: 'warning' });
    }
  };

  const handleOpenCreate = () => {
    reset({
      name: '',
      brand: '',
      categoryId: 9,
      defaultUnitTypeId: 5,
      defaultQuantity: 1,
      notes: '',
      barcode: '',
      packageLabel: '',
      packageSize: 1,
    });
    setEditingProduct(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    reset({
      name: product.name,
      brand: product.brand ?? '',
      categoryId: product.categoryId,
      defaultUnitTypeId: product.defaultUnitTypeId,
      defaultQuantity: product.defaultQuantity,
      notes: product.notes ?? '',
      barcode: product.barcode ?? '',
      packageLabel: product.packageLabel ?? '',
      packageSize: product.packageSize ?? 1,
    });
    setEditingProduct(product);
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
    setEditingProduct(null);
  };

  const onSubmit = (data: ProductFormData) => {
    const baseDto = {
      name: data.name,
      brand: data.brand || undefined,
      categoryId: data.categoryId,
      defaultUnitTypeId: data.defaultUnitTypeId,
      defaultQuantity: data.defaultQuantity,
      notes: data.notes || undefined,
      barcode: data.barcode || undefined,
      packageLabel: data.packageLabel || undefined,
      packageSize: data.packageSize || 1,
    };

    if (editingProduct) {
      updateProduct.mutate(
        { id: editingProduct.id, data: { id: editingProduct.id, ...baseDto } },
        { onSuccess: handleClose },
      );
    } else {
      createProduct.mutate(baseDto, { onSuccess: handleClose });
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

  const columns: Column<Product>[] = [
    {
      key: 'name',
      header: 'Nombre',
      align: 'left',
      render: (row) => row.name,
    },
    {
      key: 'brand',
      header: 'Marca',
      align: 'center',
      hideOnMobile: true,
      render: (row) => row.brand ?? '-',
    },
    {
      key: 'category',
      header: 'Categoria',
      align: 'center',
      render: (row) => row.categoryName ?? CATEGORIES.find(c => c.id === row.categoryId)?.name ?? '-',
    },
    {
      key: 'defaultUnit',
      header: 'Unidad',
      align: 'center',
      hideOnMobile: true,
      render: (row) => row.unitAbbreviation ?? UNIT_TYPES.find(u => u.id === row.defaultUnitTypeId)?.name ?? '-',
    },
    {
      key: 'defaultQuantity',
      header: 'Cantidad',
      align: 'center',
      render: (row) => row.defaultQuantity,
    },
    {
      key: 'notes',
      header: 'Notas',
      align: 'left',
      hideOnMobile: true,
      render: (row) => {
        const notes = row.notes;
        if (!notes) return '-';
        return (
          <Tooltip title={notes} arrow>
            <span className="truncate max-w-[150px] inline-block">{notes.length > 30 ? `${notes.slice(0, 30)}...` : notes}</span>
          </Tooltip>
        );
      },
    },
  ];

  const mobileCardRender = (product: Product) => {
    const unitAbbr = product.unitAbbreviation ?? UNIT_TYPES.find(u => u.id === product.defaultUnitTypeId)?.name ?? '';
    const categoryLabel = product.categoryName ?? CATEGORIES.find(c => c.id === product.categoryId)?.name ?? '';
    const isHighlighted = highlightedProductId === product.id;
    return (
      <div
        ref={isHighlighted ? highlightRef : undefined}
        className={`bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border transition-colors duration-500 ${isHighlighted ? 'border-blue-500 ring-2 ring-blue-300 dark:ring-blue-600' : 'border-gray-100 dark:border-gray-700'}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {product.name}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {categoryLabel} · {product.defaultQuantity} {unitAbbr}
            </div>
          </div>
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              onClick={() => handleOpenEdit(product)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Editar"
            >
              <Pencil size={18} className="text-blue-600" />
            </button>
            <button
              onClick={() => {
                setProductToDelete(product.id);
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
      <PageHeader
        title="Productos"
        helpKey="products"
        subtitle="Gestiona tu catalogo de productos"
        actionLabel="Nuevo producto"
        onAction={handleOpenCreate}
      />

      {/* Barcode search */}
      <div className="mb-4">
        {barcodeSearchOpen ? (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={barcodeSearch}
                onChange={(e) => setBarcodeSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleBarcodeSearch()}
                placeholder="Ingresa el codigo de barras"
                className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                autoFocus
              />
            </div>
            <button
              onClick={handleBarcodeSearch}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Buscar
            </button>
            <button
              onClick={() => { setBarcodeSearchOpen(false); setBarcodeSearch(''); setHighlightedProductId(null); }}
              className="px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button
            onClick={() => setBarcodeSearchOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <Search size={16} />
            Buscar por codigo
          </button>
        )}
      </div>

      {products && products.length > 0 ? (
        <ResponsiveTable
          columns={columns}
          data={products}
          keyExtractor={(p) => p.id}
          onEdit={handleOpenEdit}
          onDelete={(p) => {
            setProductToDelete(p.id);
            setDeleteDialogOpen(true);
          }}
          mobileCardRender={mobileCardRender}
        />
      ) : (
        <EmptyState
          title="No hay productos"
          description="Agrega tu primer producto para comenzar"
          action={
            <Button variant="contained" onClick={handleOpenCreate}>
              Agregar producto
            </Button>
          }
        />
      )}

      <Dialog open={dialogOpen} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            {editingProduct ? 'Editar producto' : 'Nuevo producto'}
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
                  <Autocomplete
                    freeSolo
                    value={field.value || ''}
                    onChange={(_e, newValue) => {
                      field.onChange(newValue ?? '');
                    }}
                    onInputChange={(_e, newValue) => {
                      field.onChange(newValue);
                    }}
                    options={existingBrands}
                    filterOptions={(options, params) => {
                      const filtered = brandFilter(options, params);
                      const { inputValue } = params;
                      const isExisting = options.some(
                        (opt) => opt.localeCompare(inputValue, undefined, { sensitivity: 'base' }) === 0
                      );
                      if (inputValue !== '' && !isExisting) {
                        filtered.push(inputValue);
                      }
                      return filtered;
                    }}
                    renderOption={(props, option) => {
                      const isNew = !existingBrands.some(
                        (b) => b.localeCompare(option, undefined, { sensitivity: 'base' }) === 0
                      );
                      return (
                        <li {...props} key={option}>
                          {isNew ? (
                            <span className="text-blue-600 font-medium">+ Agregar "{option}"</span>
                          ) : (
                            option
                          )}
                        </li>
                      );
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Marca"
                        placeholder="Busca o escribe una nueva"
                        fullWidth
                      />
                    )}
                  />
                )}
              />
              <Box display="flex" gap={1} alignItems="flex-start">
                <Controller
                  name="categoryId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Categoria"
                      error={!!errors.categoryId}
                      helperText={errors.categoryId?.message}
                      fullWidth
                    >
                      {CATEGORIES.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <Tooltip title="Agregar nueva categoria" arrow>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => setNewCategoryDialogOpen(true)}
                    sx={{ minWidth: 44, height: 56, px: 0 }}
                  >
                    +
                  </Button>
                </Tooltip>
              </Box>
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Controller
                  name="defaultUnitTypeId"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      select
                      label="Unidad"
                      error={!!errors.defaultUnitTypeId}
                      helperText={errors.defaultUnitTypeId?.message}
                      fullWidth
                    >
                      {UNIT_TYPES.map((ut) => (
                        <MenuItem key={ut.id} value={ut.id}>
                          {ut.name}
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
              <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', sm: 'row' } }}>
                <Controller
                  name="packageLabel"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Presentacion"
                      placeholder="Ej: bote de 1L, bolsa de 1kg"
                      fullWidth
                    />
                  )}
                />
                <Controller
                  name="packageSize"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Tamaño empaque"
                      placeholder="1"
                      fullWidth
                      inputProps={{ step: 0.25, min: 0.25 }}
                    />
                  )}
                />
              </Box>
              <Controller
                name="barcode"
                control={control}
                render={({ field }) => (
                  <TextField {...field} label="Codigo de barras" fullWidth />
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
              disabled={createProduct.isPending || updateProduct.isPending}
            >
              {editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar producto"
        message="Estas seguro de eliminar este producto? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setProductToDelete(null);
        }}
        loading={deleteProduct.isPending}
      />
      {/* Mini dialog for new category */}
      <Dialog
        open={newCategoryDialogOpen}
        onClose={() => { setNewCategoryDialogOpen(false); setNewCategoryName(''); }}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Nueva categoria</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            label="Nombre de la categoria"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            fullWidth
            sx={{ mt: 1 }}
            placeholder="Ej: Congelados, Mascotas"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setNewCategoryDialogOpen(false); setNewCategoryName(''); }}>
            Cancelar
          </Button>
          <Button
            variant="contained"
            disabled={!newCategoryName.trim() || creatingCategory}
            onClick={async () => {
              setCreatingCategory(true);
              try {
                const res = await apiClient.post('/categories', { name: newCategoryName.trim() });
                const newCat = res.data;
                await queryClient.invalidateQueries({ queryKey: ['categories'] });
                setValue('categoryId', newCat.id);
                setNewCategoryDialogOpen(false);
                setNewCategoryName('');
              } catch {
                // handle error
              }
              setCreatingCategory(false);
            }}
          >
            {creatingCategory ? 'Creando...' : 'Agregar'}
          </Button>
        </DialogActions>
      </Dialog>
      </div>
    </div>
  );
}
