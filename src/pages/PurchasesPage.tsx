import { Box, Button, Chip } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { usePurchases, useDeletePurchase } from '../hooks/usePurchases';
import { Purchase } from '../types/purchase.types';
import { formatCurrency, formatDate } from '../utils/format';

export default function PurchasesPage() {
  const navigate = useNavigate();
  const { data: purchases, isLoading } = usePurchases();
  const deletePurchase = useDeletePurchase();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);

  const handleDeleteConfirm = () => {
    if (purchaseToDelete) {
      deletePurchase.mutate(purchaseToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setPurchaseToDelete(null);
        },
      });
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'purchaseDate',
      headerName: 'Fecha',
      flex: 0.7,
      minWidth: 120,
      valueGetter: (_value: string, row: Purchase) => formatDate(row.purchaseDate),
    },
    {
      field: 'store',
      headerName: 'Tienda',
      flex: 1,
      minWidth: 150,
      valueGetter: (_value: unknown, row: Purchase) => row.store?.name ?? 'N/A',
    },
    {
      field: 'items',
      headerName: 'Items',
      flex: 0.5,
      minWidth: 80,
      renderCell: (params) => (
        <Chip label={`${params.row.items?.length ?? 0} items`} size="small" />
      ),
    },
    {
      field: 'totalAmount',
      headerName: 'Total',
      flex: 0.7,
      minWidth: 120,
      type: 'number',
      valueGetter: (_value: number, row: Purchase) => row.totalAmount,
      renderCell: (params) => (
        <Box fontWeight="bold">{formatCurrency(params.value)}</Box>
      ),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Acciones',
      width: 130,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="Ver"
          onClick={() => navigate(`/purchases/${params.row.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(`/purchases/${params.row.id}/edit`)}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => {
            setPurchaseToDelete(params.row.id);
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
        title="Compras"
        subtitle="Historial de compras realizadas"
        actionLabel="Nueva Compra"
        onAction={() => navigate('/purchases/new')}
      />

      {purchases && purchases.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={purchases}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'purchaseDate', sort: 'desc' }] },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <EmptyState
          title="No hay compras registradas"
          description="Registra tu primera compra para comenzar a llevar el control"
          action={
            <Button variant="contained" onClick={() => navigate('/purchases/new')}>
              Registrar Compra
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar Compra"
        message="Estas seguro de eliminar esta compra? Esta accion no se puede deshacer."
        confirmLabel="Eliminar"
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setDeleteDialogOpen(false);
          setPurchaseToDelete(null);
        }}
        loading={deletePurchase.isPending}
      />
    </Box>
  );
}
