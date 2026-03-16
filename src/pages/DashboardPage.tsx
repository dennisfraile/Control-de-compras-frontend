import { Grid2 as Grid, Card, CardContent, Typography, Box, Skeleton, Alert, AlertTitle, useTheme, useMediaQuery } from '@mui/material';
import {
  Warning as WarningIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
  Inventory as InventoryIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Link as RouterLink } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import { useLowStock } from '../hooks/useInventory';
import { usePurchaseSummary } from '../hooks/usePurchases';
import { useShoppingList } from '../hooks/useShoppingList';
import { formatCurrency } from '../utils/format';

function StatCard({
  title,
  subtitle,
  value,
  icon,
  iconBg,
  valueColor,
  loading,
}: {
  title: string;
  subtitle?: string;
  value: string | number;
  icon: React.ReactNode;
  iconBg: string;
  valueColor: string;
  loading?: boolean;
}) {
  return (
    <Card sx={{ height: '100%' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box display="flex" alignItems="flex-start" justifyContent="space-between">
          <Box flex={1}>
            {loading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ color: valueColor, lineHeight: 1.2 }}
              >
                {value}
              </Typography>
            )}
            <Typography
              variant="body2"
              color="text.secondary"
              fontWeight={500}
              mt={0.5}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography variant="caption" color="text.disabled">
                {subtitle}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: iconBg,
              borderRadius: '50%',
              width: 48,
              height: 48,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { data: lowStockItems, isLoading: lowStockLoading } = useLowStock();
  const { data: summary, isLoading: summaryLoading } = usePurchaseSummary();
  const { data: shoppingList, isLoading: shoppingLoading } = useShoppingList();

  const pendingItems = shoppingList?.filter((item) => !item.isChecked).length ?? 0;

  return (
    <Box>
      <PageHeader
        title="Dashboard"
        subtitle="Resumen de tu control de compras"
      />

      <Grid container spacing={2.5} mb={3}>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Gasto del Mes"
            subtitle="Total gastado este mes"
            value={summary ? formatCurrency(summary.totalSpent) : '$0'}
            icon={<MoneyIcon sx={{ color: 'white', fontSize: 24 }} />}
            iconBg="#22c55e"
            valueColor="#22c55e"
            loading={summaryLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Stock Bajo"
            subtitle="Productos por acabarse"
            value={lowStockItems?.length ?? 0}
            icon={<WarningIcon sx={{ color: 'white', fontSize: 24 }} />}
            iconBg="#ef4444"
            valueColor="#ef4444"
            loading={lowStockLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Lista de Compras"
            subtitle="Items pendientes"
            value={pendingItems}
            icon={<ShoppingCartIcon sx={{ color: 'white', fontSize: 24 }} />}
            iconBg="#3b82f6"
            valueColor="#3b82f6"
            loading={shoppingLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Inventario"
            subtitle="Total de productos"
            value={lowStockItems ? '...' : 0}
            icon={<InventoryIcon sx={{ color: 'white', fontSize: 24 }} />}
            iconBg="#8b5cf6"
            valueColor="#8b5cf6"
            loading={lowStockLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
          <StatCard
            title="Mes Anterior"
            subtitle="Variacion vs mes pasado"
            value="--"
            icon={<TrendingUpIcon sx={{ color: 'white', fontSize: 24 }} />}
            iconBg="#f59e0b"
            valueColor="#f59e0b"
            loading={summaryLoading}
          />
        </Grid>
      </Grid>

      {lowStockItems && lowStockItems.length > 0 && (
        <Alert
          severity="warning"
          sx={{ mb: 3, borderRadius: 3 }}
        >
          <AlertTitle sx={{ fontWeight: 600 }}>Productos con stock bajo</AlertTitle>
          {lowStockItems.slice(0, 5).map((item) => item.product?.name ?? 'Producto desconocido').join(', ')}
          {lowStockItems.length > 5 && ` y ${lowStockItems.length - 5} mas...`}
          {' '}
          <RouterLink to="/inventory" style={{ fontWeight: 'bold', color: 'inherit' }}>
            Ver inventario
          </RouterLink>
        </Alert>
      )}

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Gasto mensual
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Historial de gastos totales por mes
              </Typography>
              {summaryLoading ? (
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              ) : (
                <ResponsiveContainer width="100%" height={isMobile ? 250 : 300}>
                  <BarChart
                    data={summary?.monthlySpending ?? []}
                    margin={isMobile ? { top: 5, right: 10, left: 0, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} />
                    <XAxis
                      dataKey="month"
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    />
                    <YAxis
                      tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(label: string) => `Mes: ${label}`}
                      contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 8,
                      }}
                    />
                    <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
