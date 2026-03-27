import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import Spinner from '../components/atoms/Spinner';

const LandingPage = lazy(() => import('../components/pages/LandingPage'));
const LoginPage = lazy(() => import('../components/pages/LoginPage'));
const DashboardPage = lazy(() => import('../components/pages/DashboardPage'));
const ProductsPage = lazy(() => import('../components/pages/ProductsPage'));
const OrdersPage = lazy(() => import('../components/pages/OrdersPage'));
const PlanDetailPage = lazy(() => import('../components/pages/PlanDetailPage'));
const CheckoutPage = lazy(() => import('../components/pages/CheckoutPage'));
const ComparisonPage = lazy(() => import('../components/pages/ComparisonPage'));

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
  },
  {
    element: <SuspenseWrapper><ClientLayout /></SuspenseWrapper>,
    children: [
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
      { path: '/products', element: <SuspenseWrapper><ProductsPage /></SuspenseWrapper> },
      { path: '/orders', element: <SuspenseWrapper><OrdersPage /></SuspenseWrapper> },

      { path: '/settings', element: <SuspenseWrapper><SettingsPage /></SuspenseWrapper> },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

