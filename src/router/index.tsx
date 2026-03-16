import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';
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
  <div className="flex justify-center items-center min-h-screen">
    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full spinner" />
  </div>
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
