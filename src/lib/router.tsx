/* eslint-disable react-refresh/only-export-components */
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Spinner from '../components/atoms/Spinner';

const LandingPage = lazy(() => import('../components/pages/LandingPage'));
const LoginPage = lazy(() => import('../components/pages/LoginPage'));
const DashboardPage = lazy(() => import('../components/pages/DashboardPage'));
const ProductsPage = lazy(() => import('../components/pages/ProductsPage'));
const OrdersPage = lazy(() => import('../components/pages/OrdersPage'));
const FinancialPage = lazy(() => import('../components/pages/FinancialPage'));
const PlanDetailPage = lazy(() => import('../components/pages/PlanDetailPage'));
const CheckoutPage = lazy(() => import('../components/pages/CheckoutPage'));
const ComparisonPage = lazy(() => import('../components/pages/ComparisonPage'));
const StorePage = lazy(() => import('../components/pages/StorePage'));
const StoreProductPage = lazy(() => import('../components/pages/StoreProductPage'));
const CartPage = lazy(() => import('../components/pages/CartPage'));
const StoreCheckoutPage = lazy(() => import('../components/pages/StoreCheckoutPage'));
const AccountPage = lazy(() => import('../components/pages/AccountPage'));
const AccountOrdersPage = lazy(() => import('../components/pages/AccountOrdersPage'));
const SearchResultsPage = lazy(() => import('../components/pages/SearchResultsPage'));
const CategoryPage = lazy(() => import('../components/pages/CategoryPage'));
const FavoritesPage = lazy(() => import('../components/pages/FavoritesPage'));
const OrderSuccessPage = lazy(() => import('../components/pages/OrderSuccessPage'));
const NotFoundPage = lazy(() => import('../components/pages/NotFoundPage'));
const ErrorPage = lazy(() => import('../components/pages/ErrorPage'));

const SettingsPage = lazy(() => import('../components/pages/SettingsPage'));

const DashboardLayout = lazy(() => import('../components/templates/DashboardLayout'));
const AuthLayout = lazy(() => import('../components/templates/AuthLayout'));
const ClientLayout = lazy(() => import('../components/templates/ClientLayout'));

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

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
    errorElement: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
  },
  {
    element: <SuspenseWrapper><ClientLayout /></SuspenseWrapper>,
    errorElement: <SuspenseWrapper><ErrorPage /></SuspenseWrapper>,
    children: [
      {
        path: '/store',
        element: <SuspenseWrapper><StorePage /></SuspenseWrapper>,
      },
      {
        path: '/shop',
        element: <Navigate to="/store" replace />,
      },
      {
        path: '/store/product/:id',
        element: <SuspenseWrapper><StoreProductPage /></SuspenseWrapper>,
      },
      {
        path: '/cart',
        element: <SuspenseWrapper><CartPage /></SuspenseWrapper>,
      },
      {
        path: '/checkout-store',
        element: <SuspenseWrapper><StoreCheckoutPage /></SuspenseWrapper>,
      },
      {
        path: '/account',
        element: <SuspenseWrapper><AccountPage /></SuspenseWrapper>,
      },
      {
        path: '/account/orders',
        element: <SuspenseWrapper><AccountOrdersPage /></SuspenseWrapper>,
      },
      {
        path: '/search',
        element: <SuspenseWrapper><SearchResultsPage /></SuspenseWrapper>,
      },
      {
        path: '/category/:slug',
        element: <SuspenseWrapper><CategoryPage /></SuspenseWrapper>,
      },
      {
        path: '/favorites',
        element: <SuspenseWrapper><FavoritesPage /></SuspenseWrapper>,
      },
      {
        path: '/order-success',
        element: <SuspenseWrapper><OrderSuccessPage /></SuspenseWrapper>,
      },
      {
        path: '/plan/:planId',
        element: <SuspenseWrapper><PlanDetailPage /></SuspenseWrapper>,
      },
      {
        path: '/checkout/:planId',
        element: <SuspenseWrapper><CheckoutPage /></SuspenseWrapper>,
      },
      {
        path: '/comparar',
        element: <SuspenseWrapper><ComparisonPage /></SuspenseWrapper>,
      },
    ],
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
    element: (
      <ProtectedRoute>
        <SuspenseWrapper><DashboardLayout /></SuspenseWrapper>
      </ProtectedRoute>
    ),
    children: [
      { path: '/dashboard', element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper> },
      { path: '/financial', element: <SuspenseWrapper><FinancialPage /></SuspenseWrapper> },
      { path: '/products', element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper> },
      { path: '/orders', element: <SuspenseWrapper><OrdersPage /></SuspenseWrapper> },

      { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
    ],
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
    path: '*',
    element: <Navigate to="/404" replace />,
  },
]);
