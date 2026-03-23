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
const SavingsPage = lazy(() => import('../pages/SavingsPage'));
const RecipesPage = lazy(() => import('../pages/RecipesPage'));
const RestockAlertsPage = lazy(() => import('../pages/RestockAlertsPage'));
const ScanReceiptPage = lazy(() => import('../pages/ScanReceiptPage'));
const TemplatesPage = lazy(() => import('../pages/TemplatesPage'));
const ProductPriceDetailPage = lazy(() => import('../pages/ProductPriceDetailPage'));
const ReportSummaryPage = lazy(() => import('../pages/ReportSummaryPage'));
const QuickPurchasePage = lazy(() => import('../pages/QuickPurchasePage'));
const BudgetPage = lazy(() => import('../pages/BudgetPage'));
const StatisticsPage = lazy(() => import('../pages/StatisticsPage'));
const AyudaPage = lazy(() => import('../pages/AyudaPage'));
const PurchaseCalendarPage = lazy(() => import('../pages/PurchaseCalendarPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const LazyFallback = (
  <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
    <div className="text-gray-600 dark:text-gray-400">Cargando...</div>
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
            path: '/savings',
            element: (
              <SuspenseWrapper>
                <SavingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/recipes',
            element: (
              <SuspenseWrapper>
                <RecipesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/restock-alerts',
            element: (
              <SuspenseWrapper>
                <RestockAlertsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/scan-receipt',
            element: (
              <SuspenseWrapper>
                <ScanReceiptPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/products/:id/prices',
            element: (
              <SuspenseWrapper>
                <ProductPriceDetailPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/reports',
            element: (
              <SuspenseWrapper>
                <ReportSummaryPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/quick-purchase',
            element: (
              <SuspenseWrapper>
                <QuickPurchasePage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/templates',
            element: (
              <SuspenseWrapper>
                <TemplatesPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/budget',
            element: (
              <SuspenseWrapper>
                <BudgetPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/statistics',
            element: (
              <SuspenseWrapper>
                <StatisticsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/calendar',
            element: (
              <SuspenseWrapper>
                <PurchaseCalendarPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: '/ayuda',
            element: (
              <SuspenseWrapper>
                <AyudaPage />
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
