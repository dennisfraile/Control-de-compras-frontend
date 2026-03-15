import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '../components/layout/AppLayout';
import ProtectedRoute from '../components/auth/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import ProductsPage from '../pages/ProductsPage';
import PurchasesPage from '../pages/PurchasesPage';
import PurchaseFormPage from '../pages/PurchaseFormPage';
import InventoryPage from '../pages/InventoryPage';
import ShoppingListPage from '../pages/ShoppingListPage';
import PriceComparisonPage from '../pages/PriceComparisonPage';
import CommunityPricesPage from '../pages/CommunityPricesPage';
import StoresPage from '../pages/StoresPage';
import NotFoundPage from '../pages/NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            path: '/',
            element: <DashboardPage />,
          },
          {
            path: '/products',
            element: <ProductsPage />,
          },
          {
            path: '/purchases',
            element: <PurchasesPage />,
          },
          {
            path: '/purchases/new',
            element: <PurchaseFormPage />,
          },
          {
            path: '/purchases/:id/edit',
            element: <PurchaseFormPage />,
          },
          {
            path: '/inventory',
            element: <InventoryPage />,
          },
          {
            path: '/shopping-list',
            element: <ShoppingListPage />,
          },
          {
            path: '/prices',
            element: <PriceComparisonPage />,
          },
          {
            path: '/prices/community',
            element: <CommunityPricesPage />,
          },
          {
            path: '/stores',
            element: <StoresPage />,
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export default router;
