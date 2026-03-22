import { Box, Button, Chip, useTheme, useMediaQuery } from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon, FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DependencyBanner from '../components/onboarding/DependencyBanner';
import { usePurchases, useDeletePurchase } from '../hooks/usePurchases';
import { useStores } from '../hooks/useStores';
import { useProducts } from '../hooks/useProducts';
import { purchasesApi } from '../api/purchases.api';
import { Purchase } from '../types/purchase.types';
import { formatCurrency, formatDate } from '../utils/format';

export default function PurchasesPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { data: purchases, isLoading } = usePurchases();
  const deletePurchase = useDeletePurchase();
  const { data: stores } = useStores();
  const { data: products } = useProducts();
  const hasStores = (stores?.length ?? 0) > 0;
  const hasProducts = (products?.length ?? 0) > 0;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    try {
      setExporting(true);
      const blob = await purchasesApi.export();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'compras.xlsx';
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
      field: 'purchaseDateUtc',
      headerName: 'Fecha',
      flex: 0.7,
      minWidth: isMobile ? 90 : 120,
      valueGetter: (_value: string, row: Purchase) => formatDate(row.purchaseDateUtc),
    },
    {
      field: 'storeName',
      headerName: 'Tienda',
      flex: 1,
      minWidth: isMobile ? 100 : 150,
      valueGetter: (_value: unknown, row: Purchase) => row.storeName ?? 'N/A',
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
      minWidth: isMobile ? 90 : 120,
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
      width: isMobile ? 70 : 130,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="Ver"
          onClick={() => navigate(`/purchases/${params.row.id}/edit`)}
          sx={{ minHeight: 44, minWidth: 44 }}
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Editar"
          onClick={() => navigate(`/purchases/${params.row.id}/edit`)}
          sx={{ minHeight: 44, minWidth: 44 }}
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Eliminar"
          onClick={() => {
            setPurchaseToDelete(params.row.id);
            setDeleteDialogOpen(true);
          }}
          sx={{ minHeight: 44, minWidth: 44 }}
        />,
      ],
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <DependencyBanner
        show={!hasStores || !hasProducts}
        message="Para registrar compras necesitas al menos una tienda y productos."
        actionLabel="Ir a tiendas"
        actionPath="/stores"
      />

      <PageHeader
        title="Compras"
        helpKey="purchases"
        subtitle="Historial de compras realizadas"
        actionLabel="Nueva compra"
        onAction={() => navigate('/purchases/new')}
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

      {purchases && purchases.length > 0 ? (
        <Box sx={{ height: { xs: 350, sm: 450, md: 600 }, width: '100%' }}>
          <DataGrid
            rows={purchases}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 10 } },
              sorting: { sortModel: [{ field: 'purchaseDate', sort: 'desc' }] },
            }}
            columnVisibilityModel={{ items: !isMobile, purchaseDateUtc: !isMobile }}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <EmptyState
          title="No hay compras registradas"
          description="Registra tu primera compra para comenzar a llevar el control"
          action={
            <Button variant="contained" onClick={() => navigate('/purchases/new')}>
              Registrar compra
            </Button>
          }
        />
      )}

      <ConfirmDialog
        open={deleteDialogOpen}
        title="Eliminar compra"
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
