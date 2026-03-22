import { Box } from '@mui/material';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ResponsiveTable, { Column } from '../components/common/ResponsiveTable';
import { useCommunityPrices } from '../hooks/usePrices';
import { PriceSuggestion } from '../types/price.types';
import { formatCurrency, formatDateTime } from '../utils/format';

export default function CommunityPricesPage() {
  const { data: prices, isLoading } = useCommunityPrices();

  const columns: Column<PriceSuggestion>[] = [
    {
      key: 'productName',
      header: 'Producto',
      align: 'left',
      render: (row) => row.productName,
    },
    {
      key: 'storeName',
      header: 'Tienda',
      align: 'center',
      render: (row) => row.storeName,
    },
    {
      key: 'price',
      header: 'Precio',
      align: 'center',
      render: (row) => formatCurrency(row.price),
    },
    {
      key: 'reportedAt',
      header: 'Reportado',
      align: 'center',
      hideOnMobile: true,
      render: (row) => formatDateTime(row.reportedAt),
    },
  ];

  const mobileCardRender = (price: PriceSuggestion) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {price.productName}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {price.storeName} · {formatCurrency(price.price)}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader
        title="Precios de la comunidad"
        helpKey="community"
        subtitle="Precios reportados anonimamente por otros usuarios"
      />

      {prices && prices.length > 0 ? (
        <ResponsiveTable
          columns={columns}
          data={prices}
          keyExtractor={(p) => p.id}
          mobileCardRender={mobileCardRender}
        />
      ) : (
        <EmptyState
          title="Sin precios comunitarios"
          description="Aun no hay precios reportados por la comunidad"
        />
      )}
    </Box>
  );
}
