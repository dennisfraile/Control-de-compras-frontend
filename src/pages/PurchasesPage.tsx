import { Box, Button } from '@mui/material';
import { FileDownload as FileDownloadIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Pencil, Trash2, Eye, Copy } from 'lucide-react';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DependencyBanner from '../components/onboarding/DependencyBanner';
import ResponsiveTable, { Column } from '../components/common/ResponsiveTable';
import { usePurchases, useDeletePurchase, useCreatePurchase } from '../hooks/usePurchases';
import { useStores } from '../hooks/useStores';
import { useProducts } from '../hooks/useProducts';
import { purchasesApi } from '../api/purchases.api';
import { Purchase } from '../types/purchase.types';
import { formatCurrency, formatDate } from '../utils/format';

export default function PurchasesPage() {
  const navigate = useNavigate();
  const { data: purchases, isLoading } = usePurchases();
  const deletePurchase = useDeletePurchase();
  const createPurchase = useCreatePurchase();
  const { data: stores } = useStores();
  const { data: products } = useProducts();
  const hasStores = (stores?.length ?? 0) > 0;
  const hasProducts = (products?.length ?? 0) > 0;

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [purchaseToDelete, setPurchaseToDelete] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);
  const [duplicating, setDuplicating] = useState(false);

  // #3 - Duplicate purchase
  const handleDuplicate = (purchase: Purchase) => {
    if (duplicating || !purchase.items?.length) return;
    setDuplicating(true);
    createPurchase.mutate(
      {
        storeId: purchase.storeId,
        purchaseDateUtc: new Date().toISOString(),
        notes: `Copia de compra del ${new Date(purchase.purchaseDateUtc).toLocaleDateString('es')}`,
        items: purchase.items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          unitTypeId: item.unitTypeId,
          unitPrice: item.unitPrice,
          addToInventory: false,
        })),
      },
      {
        onSettled: () => setDuplicating(false),
      },
    );
  };

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

  const columns: Column<Purchase>[] = [
    {
      key: 'purchaseDateUtc',
      header: 'Fecha',
      align: 'left',
      hideOnMobile: true,
      render: (row) => formatDate(row.purchaseDateUtc),
    },
    {
      key: 'storeName',
      header: 'Tienda',
      align: 'center',
      render: (row) => row.storeName ?? 'N/A',
    },
    {
      key: 'items',
      header: 'Items',
      align: 'center',
      hideOnMobile: true,
      render: (row) => (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
          {row.items?.length ?? 0} items
        </span>
      ),
    },
    {
      key: 'totalAmount',
      header: 'Total',
      align: 'center',
      render: (row) => (
        <span className="font-bold">{formatCurrency(row.totalAmount)}</span>
      ),
    },
  ];

  const purchaseActions = (row: Purchase) => (
    <div className="flex items-center gap-1">
      <button
        onClick={() => navigate(`/purchases/${row.id}/edit`)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Ver"
      >
        <Eye size={18} className="text-green-600" />
      </button>
      <button
        onClick={() => handleDuplicate(row)}
        disabled={duplicating}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
        title="Repetir compra"
      >
        <Copy size={18} className="text-purple-600" />
      </button>
      <button
        onClick={() => navigate(`/purchases/${row.id}/edit`)}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Editar"
      >
        <Pencil size={18} className="text-blue-600" />
      </button>
      <button
        onClick={() => {
          setPurchaseToDelete(row.id);
          setDeleteDialogOpen(true);
        }}
        className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        title="Eliminar"
      >
        <Trash2 size={18} className="text-red-600" />
      </button>
    </div>
  );

  const mobileCardRender = (purchase: Purchase) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
            {purchase.storeName ?? 'N/A'}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formatDate(purchase.purchaseDateUtc)} · {formatCurrency(purchase.totalAmount)}
          </div>
          {/* #10 - Tags */}
          {purchase.tags && (
            <div className="flex flex-wrap gap-1 mt-2">
              {purchase.tags.split(',').map((tag) => (
                <span
                  key={tag.trim()}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium"
                >
                  {tag.trim()}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2 shrink-0">
          {purchaseActions(purchase)}
        </div>
      </div>
    </div>
  );

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
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
        <ResponsiveTable
          columns={columns}
          data={purchases}
          keyExtractor={(p) => p.id}
          actions={purchaseActions}
          mobileCardRender={mobileCardRender}
        />
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
      </div>
    </div>
  );
}
