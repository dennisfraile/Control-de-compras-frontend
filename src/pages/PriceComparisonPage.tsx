import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmptyState from '../components/common/EmptyState';
import { useProducts } from '../hooks/useProducts';
import { usePriceHistory } from '../hooks/usePrices';
import { formatCurrency, formatDate } from '../utils/format';

const CHART_COLORS = [
  '#1976d2',
  '#e91e63',
  '#4caf50',
  '#ff9800',
  '#9c27b0',
  '#00bcd4',
  '#795548',
  '#607d8b',
];

export default function PriceComparisonPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { data: products, isLoading: productsLoading } = useProducts();
  const [selectedProductId, setSelectedProductId] = useState('');

  const { data: priceHistory, isLoading: priceLoading } = usePriceHistory({
    productId: selectedProductId,
  });

  // Group price points by date for the chart, with each store as a separate line
  const chartData = (() => {
    if (!priceHistory || priceHistory.length === 0) return [];

    const dateMap = new Map<string, Record<string, number>>();
    const storeSet = new Set<string>();

    priceHistory.forEach((point) => {
      const dateKey = formatDate(point.date);
      storeSet.add(point.storeName);

      if (!dateMap.has(dateKey)) {
        dateMap.set(dateKey, {});
      }
      dateMap.get(dateKey)![point.storeName] = point.price;
    });

    return Array.from(dateMap.entries())
      .map(([date, stores]) => ({ date, ...stores }))
      .sort((a, b) => a.date.localeCompare(b.date));
  })();

  const storeNames = (() => {
    if (!priceHistory) return [];
    return [...new Set(priceHistory.map((p) => p.storeName))];
  })();

  if (productsLoading) return <LoadingSpinner />;

  return (
    <Box>
      <PageHeader
        title="Comparacion de Precios"
        helpKey="prices"
        subtitle="Analiza la evolucion de precios por producto y tienda"
      >
        <Button variant="outlined" onClick={() => navigate('/prices/community')}>
          Precios de la Comunidad
        </Button>
      </PageHeader>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <TextField
            select
            label="Selecciona un producto"
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            sx={{ minWidth: { xs: '100%', sm: 300 } }}
          >
            <MenuItem value="">
              <em>Seleccionar...</em>
            </MenuItem>
            {products?.map((product) => (
              <MenuItem key={product.id} value={product.id}>
                {product.name} {product.brand ? `(${product.brand})` : ''}
              </MenuItem>
            ))}
          </TextField>
        </CardContent>
      </Card>

      {selectedProductId ? (
        priceLoading ? (
          <LoadingSpinner message="Cargando historial de precios..." />
        ) : chartData.length > 0 ? (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Historial de Precios
              </Typography>
              <ResponsiveContainer width="100%" height={isMobile ? 250 : 400}>
                <LineChart
                  data={chartData}
                  margin={isMobile ? { top: 5, right: 5, left: 0, bottom: 5 } : { top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  {storeNames.map((store, index) => (
                    <Line
                      key={store}
                      type="monotone"
                      dataKey={store}
                      stroke={CHART_COLORS[index % CHART_COLORS.length]}
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      connectNulls
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        ) : (
          <EmptyState
            title="Sin datos de precios"
            description="No hay historial de precios para este producto"
          />
        )
      ) : (
        <EmptyState
          title="Selecciona un producto"
          description="Elige un producto del selector para ver su historial de precios"
        />
      )}
    </Box>
  );
}
