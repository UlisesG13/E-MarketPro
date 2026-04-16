import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAdminAuthStore } from '../entities/admin/store/adminAuthStore';
import { useCustomerAuthStore } from '../entities/customer/store/customerAuthStore';
import Spinner from '../shared/components/atoms/Spinner';


function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a14] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Spinner size="lg" />
            <p className="text-sm text-gray-500">Cargando...</p>
          </div>
        </div>
      }
    >
      {children}
    </Suspense>
  );
}


function AdminProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function CustomerProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useCustomerAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ redirectTo: 'customer' }} />;
  return <>{children}</>;
}


const LandingPage = lazy(() => import('../shared/components/pages/LandingPage'));
const LoginPage = lazy(() => import('../shared/components/pages/LoginPage'));
const NotFoundPage = lazy(() => import('../shared/components/pages/NotFoundPage'));
const ErrorPage = lazy(() => import('../shared/components/pages/ErrorPage'));
const PlanDetailPage = lazy(() => import('../shared/components/pages/PlanDetailPage'));
const ComparisonPage = lazy(() => import('../shared/components/pages/ComparisonPage'));


const DashboardPage = lazy(() => import('../entities/admin/components/pages/DashboardPage'));
const ProductsPage = lazy(() => import('../entities/admin/components/pages/ProductsPage'));
const OrdersPage = lazy(() => import('../entities/admin/components/pages/OrdersPage'));
const FinancialPage = lazy(() => import('../entities/admin/components/pages/FinancialPage'));
const SettingsPage = lazy(() => import('../entities/admin/components/pages/SettingsPage'));
const CheckoutPage = lazy(() => import('../entities/admin/components/pages/CheckoutPage'));


const StorePage = lazy(() => import('../entities/customer/components/pages/StorePage'));
const StoreProductPage = lazy(() => import('../entities/customer/components/pages/StoreProductPage'));
const CartPage = lazy(() => import('../entities/customer/components/pages/CartPage'));
const StoreCheckoutPage = lazy(() => import('../entities/customer/components/pages/StoreCheckoutPage'));
const AccountPage = lazy(() => import('../entities/customer/components/pages/AccountPage'));
const AccountOrdersPage = lazy(() => import('../entities/customer/components/pages/AccountOrdersPage'));
const SearchResultsPage = lazy(() => import('../entities/customer/components/pages/SearchResultsPage'));
const CategoryPage = lazy(() => import('../entities/customer/components/pages/CategoryPage'));
const FavoritesPage = lazy(() => import('../entities/customer/components/pages/FavoritesPage'));
const OrderSuccessPage = lazy(() => import('../entities/customer/components/pages/OrderSuccessPage'));


const DashboardLayout = lazy(() => import('../entities/admin/components/templates/DashboardLayout'));
const AuthLayout = lazy(() => import('../shared/components/templates/AuthLayout'));
const ClientLayout = lazy(() => import('../entities/customer/components/templates/ClientLayout'));


export const router = createBrowserRouter([
  {
    path: '/',
    element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
    errorElement: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
  },
  {
    path: '/404',
    element: <SuspenseWrapper><NotFoundPage /></SuspenseWrapper>,
  },
  {
    path: '/error',
    element: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
  },

  {
    element: <SuspenseWrapper><AuthLayout /></SuspenseWrapper>,
    errorElement: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
    ],
  },

  {
    element: <SuspenseWrapper><ClientLayout /></SuspenseWrapper>,
    errorElement: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
    children: [
      { path: '/store', element: <SuspenseWrapper><StorePage /></SuspenseWrapper> },
      { path: '/shop', element: <Navigate to="/store" replace /> },
      { path: '/store/product/:id', element: <SuspenseWrapper><StoreProductPage /></SuspenseWrapper> },
      { path: '/cart', element: <SuspenseWrapper><CartPage /></SuspenseWrapper> },
      { path: '/search', element: <SuspenseWrapper><SearchResultsPage /></SuspenseWrapper> },
      { path: '/category/:slug', element: <SuspenseWrapper><CategoryPage /></SuspenseWrapper> },
      { path: '/favorites', element: <SuspenseWrapper><FavoritesPage /></SuspenseWrapper> },
      { path: '/plan/:planId', element: <SuspenseWrapper><PlanDetailPage /></SuspenseWrapper> },
      { path: '/comparar', element: <SuspenseWrapper><ComparisonPage /></SuspenseWrapper> },

      {
        path: '/checkout-store',
        element: (
          <CustomerProtectedRoute>
            <SuspenseWrapper><StoreCheckoutPage /></SuspenseWrapper>
          </CustomerProtectedRoute>
        ),
      },
      {
        path: '/order-success',
        element: (
          <CustomerProtectedRoute>
            <SuspenseWrapper><OrderSuccessPage /></SuspenseWrapper>
          </CustomerProtectedRoute>
        ),
      },
      {
        path: '/account',
        element: (
          <CustomerProtectedRoute>
            <SuspenseWrapper><AccountPage /></SuspenseWrapper>
          </CustomerProtectedRoute>
        ),
      },
      {
        path: '/account/orders',
        element: (
          <CustomerProtectedRoute>
            <SuspenseWrapper><AccountOrdersPage /></SuspenseWrapper>
          </CustomerProtectedRoute>
        ),
      },
    ],
  },

  {
    element: (
      <AdminProtectedRoute>
        <SuspenseWrapper><DashboardLayout /></SuspenseWrapper>
      </AdminProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: '/products', element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper> },
      { path: '/orders', element: <SuspenseWrapper><OrdersPage /></SuspenseWrapper> },
      { path: '/financial', element: <SuspenseWrapper><FinancialPage /></SuspenseWrapper> },
      { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
      { path: '/checkout/:planId', element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper> },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
