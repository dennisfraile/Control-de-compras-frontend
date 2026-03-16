import { useEffect, useMemo } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Typography,
  MenuItem,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import dayjs, { Dayjs } from 'dayjs';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useProducts } from '../hooks/useProducts';
import { useStores } from '../hooks/useStores';
import { usePurchase, useCreatePurchase, useUpdatePurchase } from '../hooks/usePurchases';
import { formatCurrency } from '../utils/format';

const purchaseItemSchema = z.object({
  productId: z.string().min(1, 'Selecciona un producto'),
  quantity: z.coerce.number().positive('La cantidad debe ser mayor a 0'),
  unitPrice: z.coerce.number().positive('El precio debe ser mayor a 0'),
  notes: z.string().optional(),
});

const purchaseSchema = z.object({
  storeId: z.string().min(1, 'Selecciona una tienda'),
  purchaseDate: z.custom<Dayjs>((val) => dayjs.isDayjs(val) && val.isValid(), {
    message: 'Fecha requerida',
  }),
  notes: z.string().optional(),
  items: z.array(purchaseItemSchema).min(1, 'Agrega al menos un producto'),
});

type PurchaseFormData = z.infer<typeof purchaseSchema>;

export default function PurchaseFormPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = !!id;

  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: stores, isLoading: storesLoading } = useStores();
  const { data: existingPurchase, isLoading: purchaseLoading } = usePurchase(id ?? '');
  const createPurchase = useCreatePurchase();
  const updatePurchase = useUpdatePurchase();

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<PurchaseFormData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      storeId: '',
      purchaseDate: dayjs(),
      notes: '',
      items: [{ productId: '', quantity: 1, unitPrice: 0, notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  useEffect(() => {
    if (existingPurchase && isEditing) {
      reset({
        storeId: existingPurchase.storeId,
        purchaseDate: dayjs(existingPurchase.purchaseDate),
        notes: existingPurchase.notes ?? '',
        items: existingPurchase.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          notes: item.notes ?? '',
        })),
      });
    }
  }, [existingPurchase, isEditing, reset]);

  const watchedItems = watch('items');

  const totalAmount = useMemo(() => {
    return watchedItems.reduce((sum, item) => {
      return sum + (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
    }, 0);
  }, [watchedItems]);

  const onSubmit = (data: PurchaseFormData) => {
    const dto = {
      storeId: data.storeId,
      purchaseDate: data.purchaseDate.toISOString(),
      notes: data.notes || undefined,
      items: data.items.map((item) => ({
        productId: item.productId,
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        notes: item.notes || undefined,
      })),
    };

    if (isEditing && id) {
      updatePurchase.mutate(
        { id, data: dto },
        { onSuccess: () => navigate('/purchases') },
      );
    } else {
      createPurchase.mutate(dto, {
        onSuccess: () => navigate('/purchases'),
      });
    }
  };

  if (productsLoading || storesLoading || (isEditing && purchaseLoading)) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <PageHeader
        title={isEditing ? 'Editar Compra' : 'Nueva Compra'}
        subtitle="Registra los detalles de tu compra"
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Informacion General
            </Typography>
            <Box display="flex" gap={2} sx={{ flexDirection: { xs: 'column', md: 'row' }, flexWrap: 'wrap' }}>
              <Controller
                name="storeId"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    label="Tienda"
                    error={!!errors.storeId}
                    helperText={errors.storeId?.message}
                    sx={{ minWidth: { xs: 0, sm: 250 }, width: { xs: '100%', md: 'auto' } }}
                  >
                    {stores?.map((store) => (
                      <MenuItem key={store.id} value={store.id}>
                        {store.name}
                      </MenuItem>
                    ))}
                  </TextField>
                )}
              />
              <Controller
                name="purchaseDate"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Fecha de compra"
                    value={field.value}
                    onChange={field.onChange}
                    slotProps={{
                      textField: {
                        error: !!errors.purchaseDate,
                        helperText: errors.purchaseDate?.message as string,
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Notas"
                    sx={{ flexGrow: 1, minWidth: { xs: 0, sm: 200 }, width: { xs: '100%', md: 'auto' } }}
                  />
                )}
              />
            </Box>
          </CardContent>
        </Card>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Productos</Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={() =>
                  append({ productId: '', quantity: 1, unitPrice: 0, notes: '' })
                }
                size="small"
              >
                Agregar Producto
              </Button>
            </Box>

            {errors.items && typeof errors.items === 'object' && 'message' in errors.items && (
              <Typography color="error" variant="body2" mb={2}>
                {errors.items.message as string}
              </Typography>
            )}

            {fields.map((field, index) => {
              const qty = Number(watchedItems[index]?.quantity) || 0;
              const price = Number(watchedItems[index]?.unitPrice) || 0;
              const lineTotal = qty * price;

              return (
                <Box key={field.id}>
                  <Box display="flex" gap={2} alignItems="flex-start" mb={2} sx={{ flexDirection: { xs: 'column', sm: 'row' }, flexWrap: 'wrap' }}>
                    <Controller
                      name={`items.${index}.productId`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField
                          {...f}
                          select
                          label="Producto"
                          error={!!errors.items?.[index]?.productId}
                          helperText={errors.items?.[index]?.productId?.message}
                          sx={{ minWidth: { xs: 0, sm: 200 }, flexGrow: 1, width: { xs: '100%', sm: 'auto' } }}
                          size="small"
                        >
                          {products?.map((p) => (
                            <MenuItem key={p.id} value={p.id}>
                              {p.name} {p.brand ? `(${p.brand})` : ''}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                    <Controller
                      name={`items.${index}.quantity`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField
                          {...f}
                          type="number"
                          label="Cantidad"
                          error={!!errors.items?.[index]?.quantity}
                          helperText={errors.items?.[index]?.quantity?.message}
                          sx={{ width: { xs: '100%', sm: 120 } }}
                          size="small"
                        />
                      )}
                    />
                    <Controller
                      name={`items.${index}.unitPrice`}
                      control={control}
                      render={({ field: f }) => (
                        <TextField
                          {...f}
                          type="number"
                          label="Precio Unitario"
                          error={!!errors.items?.[index]?.unitPrice}
                          helperText={errors.items?.[index]?.unitPrice?.message}
                          sx={{ width: { xs: '100%', sm: 150 } }}
                          size="small"
                        />
                      )}
                    />
                    <Box
                      display="flex"
                      alignItems="center"
                      sx={{ minWidth: 100, pt: 1 }}
                    >
                      <Typography variant="body2" fontWeight="bold">
                        {formatCurrency(lineTotal)}
                      </Typography>
                    </Box>
                    <IconButton
                      color="error"
                      onClick={() => remove(index)}
                      disabled={fields.length <= 1}
                      size="small"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                  {index < fields.length - 1 && <Divider sx={{ mb: 2 }} />}
                </Box>
              );
            })}

            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end">
              <Typography variant="h5" fontWeight="bold">
                Total: {formatCurrency(totalAmount)}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Box display="flex" gap={2} justifyContent="flex-end" sx={{ flexDirection: { xs: 'column-reverse', sm: 'row' } }}>
          <Button variant="outlined" onClick={() => navigate('/purchases')}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createPurchase.isPending || updatePurchase.isPending}
          >
            {isEditing ? 'Actualizar Compra' : 'Registrar Compra'}
          </Button>
        </Box>
      </form>
    </Box>
  );
}
