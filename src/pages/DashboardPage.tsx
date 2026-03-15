import { Grid2 as Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import {
  Warning as WarningIcon,
  ShoppingCart as ShoppingCartIcon,
  AttachMoney as MoneyIcon,
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
import PageHeader from '../components/common/PageHeader';
import { useLowStock } from '../hooks/useInventory';
import { usePurchaseSummary } from '../hooks/usePurchases';
import { useShoppingList } from '../hooks/useShoppingList';
import { formatCurrency } from '../utils/format';

function StatCard({
  title,
  value,
  icon,
  color,
  loading,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box>
            <Typography variant="body2" color="text.secondary">
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={80} height={40} />
            ) : (
              <Typography variant="h4" fontWeight="bold" mt={1}>
                {value}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              bgcolor: color,
              borderRadius: 2,
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
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

      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Productos con stock bajo"
            value={lowStockItems?.length ?? 0}
            icon={<WarningIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#ef5350"
            loading={lowStockLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Items en lista de compras"
            value={pendingItems}
            icon={<ShoppingCartIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#42a5f5"
            loading={shoppingLoading}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <StatCard
            title="Gasto total del mes"
            value={summary ? formatCurrency(summary.totalSpent) : '$0'}
            icon={<MoneyIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#66bb6a"
            loading={summaryLoading}
          />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Gasto mensual
          </Typography>
          {summaryLoading ? (
            <Skeleton variant="rectangular" height={300} />
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={summary?.monthlySpending ?? []}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  labelFormatter={(label: string) => `Mes: ${label}`}
                />
                <Bar dataKey="total" fill="#1976d2" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
