import { Box } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useCommunityPrices } from '../hooks/usePrices';
import { PriceSuggestion } from '../types/price.types';
import { formatCurrency, formatDateTime } from '../utils/format';

export default function CommunityPricesPage() {
  const { data: prices, isLoading } = useCommunityPrices();

  const columns: GridColDef[] = [
    {
      field: 'productName',
      headerName: 'Producto',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'storeName',
      headerName: 'Tienda',
      flex: 1,
      minWidth: 150,
    },
    {
      field: 'price',
      headerName: 'Precio',
      flex: 0.7,
      minWidth: 120,
      type: 'number',
      renderCell: (params) => formatCurrency(params.value),
    },
    {
      field: 'reportedAt',
      headerName: 'Reportado',
      flex: 0.8,
      minWidth: 150,
      valueGetter: (_value: string, row: PriceSuggestion) => formatDateTime(row.reportedAt),
    },
  ];

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader
        title="Precios de la Comunidad"
        subtitle="Precios reportados anonimamente por otros usuarios"
      />

      {prices && prices.length > 0 ? (
        <Box sx={{ height: 600, width: '100%' }}>
          <DataGrid
            rows={prices}
            columns={columns}
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: { paginationModel: { pageSize: 25 } },
              sorting: { sortModel: [{ field: 'reportedAt', sort: 'desc' }] },
            }}
            disableRowSelectionOnClick
          />
        </Box>
      ) : (
        <EmptyState
          title="Sin precios comunitarios"
          description="Aun no hay precios reportados por la comunidad"
        />
      )}
    </Box>
  );
}
