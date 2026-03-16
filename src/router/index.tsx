import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from '../components/auth/ProtectedRoute';

const AppLayout = lazy(() => import('../components/layout/AppLayout'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const DashboardPage = lazy(() => import('../pages/DashboardPage'));
const ProductsPage = lazy(() => import('../pages/ProductsPage'));
const PurchasesPage = lazy(() => import('../pages/PurchasesPage'));
const PurchaseFormPage = lazy(() => import('../pages/PurchaseFormPage'));
const InventoryPage = lazy(() => import('../pages/InventoryPage'));
const ShoppingListPage = lazy(() => import('../pages/ShoppingListPage'));
const PriceComparisonPage = lazy(() => import('../pages/PriceComparisonPage'));
const CommunityPricesPage = lazy(() => import('../pages/CommunityPricesPage'));
const StoresPage = lazy(() => import('../pages/StoresPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const LazyFallback = (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
    <CircularProgress />
  </Box>
);

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={LazyFallback}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (
          <SuspenseWrapper>
            <AppLayout />
          </SuspenseWrapper>
        ),
        children: [
          {
            path: '/',
            element: (
              <SuspenseWrapper>
                <DashboardPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/products',
            element: (
              <SuspenseWrapper>
                <ProductsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/purchases',
            element: (
              <SuspenseWrapper>
                <PurchasesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/purchases/new',
            element: (
              <SuspenseWrapper>
                <PurchaseFormPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/purchases/:id/edit',
            element: (
              <SuspenseWrapper>
                <PurchaseFormPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/inventory',
            element: (
              <SuspenseWrapper>
                <InventoryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/shopping-list',
            element: (
              <SuspenseWrapper>
                <ShoppingListPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/prices',
            element: (
              <SuspenseWrapper>
                <PriceComparisonPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/prices/community',
            element: (
              <SuspenseWrapper>
                <CommunityPricesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/stores',
            element: (
              <SuspenseWrapper>
                <StoresPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/profile',
            element: (
              <SuspenseWrapper>
                <ProfilePage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: (
      <SuspenseWrapper>
        <NotFoundPage />
      </SuspenseWrapper>
    ),
  },
]);

export default router;
