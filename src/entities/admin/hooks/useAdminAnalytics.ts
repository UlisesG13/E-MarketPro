import { useQuery } from '@tanstack/react-query';
import { analyticsService } from '../services/analyticsService';
import { useAdminAuthStore } from '../store/adminAuthStore';

const analyticsKeys = {
  dashboard: (storeId: string) => ['analytics', 'dashboard', storeId] as const,
};

export function useAdminDashboard() {
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  return useQuery({
    queryKey: analyticsKeys.dashboard(storeId),
    queryFn: () => analyticsService.getDashboard(),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 3, // 3 minutes
  });
}

// ─── Legacy hook — kept for backwards compatibility ───────
// Pages that previously used useAdminAnalytics() now use useAdminDashboard()
export function useAdminAnalytics() {
  const storeId = useAdminAuthStore((s) => s.store?.id ?? '');

  const { data, isLoading, error } = useQuery({
    queryKey: analyticsKeys.dashboard(storeId),
    queryFn: () => analyticsService.getDashboard(),
    enabled: !!storeId,
    staleTime: 1000 * 60 * 3,
  });

  return {
    dashboard: data ?? null,
    kpis: data
      ? [
          {
            label: 'Ingresos del mes',
            value: Number(data.total_revenue_month),
            prefix: '$',
            trend: 0,
            icon: 'DollarSign',
          },
          {
            label: 'Órdenes del mes',
            value: data.total_orders_month,
            trend: 0,
            icon: 'ShoppingBag',
          },
          {
            label: 'Ticket promedio',
            value:
              data.total_orders_month > 0
                ? Math.round(Number(data.total_revenue_month) / data.total_orders_month)
                : 0,
            prefix: '$',
            trend: 0,
            icon: 'TrendingUp',
          },
        ]
      : [],
    weeklyRevenue: data
      ? data.sales_last_7_days.map((d) => ({
          week: d.date,
          revenue: Number(d.revenue),
          orders: d.orders,
        }))
      : [],
    topProducts: data
      ? data.top_5_products.map((p) => ({
          id: p.product_id,
          name: p.product_name,
          revenue: Number(p.total_revenue),
          units: p.total_sold,
          image: '',
        }))
      : [],
    isLoading,
    error: error instanceof Error ? error.message : null,
  };
}
