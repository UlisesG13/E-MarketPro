import { apiClient } from '@/shared/services/apiClient';
import type {
  KPIData,
  WeeklyRevenue,
  CategoryRevenue,
  TopProduct,
} from '../types/analytics.types';

// ─── Backend response shapes ──────────────────────────────

interface DailySales {
  date: string;
  revenue: number;
  orders: number;
}

interface BackendTopProduct {
  product_id: string;
  product_name: string;
  total_sold: number;
  total_revenue: number;
}

export interface DashboardResponse {
  sales_last_7_days: DailySales[];
  top_5_products: BackendTopProduct[];
  total_revenue_month: number;
  total_orders_month: number;
}

// ─── Adapters ─────────────────────────────────────────────

function adaptDashboardToKPIs(data: DashboardResponse): KPIData[] {
  const avgTicket =
    data.total_orders_month > 0
      ? data.total_revenue_month / data.total_orders_month
      : 0;

  return [
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
      value: Number(avgTicket.toFixed(2)),
      prefix: '$',
      trend: 0,
      icon: 'TrendingUp',
    },
  ];
}

function adaptDailyToWeekly(data: DailySales[]): WeeklyRevenue[] {
  return data.map((d) => ({
    week: d.date,
    revenue: Number(d.revenue),
    orders: d.orders,
  }));
}

function adaptTopProducts(data: BackendTopProduct[]): TopProduct[] {
  return data.map((p) => ({
    id: p.product_id,
    name: p.product_name,
    revenue: Number(p.total_revenue),
    units: p.total_sold,
    image: '',
  }));
}

// ─── Service ──────────────────────────────────────────────

export const analyticsService = {
  /** GET /analytics/dashboard */
  getDashboard: () =>
    apiClient.get<DashboardResponse>('/analytics/dashboard', 'admin'),

  /** Derived — calls getDashboard and returns KPI array */
  getKPIs: async (): Promise<{ kpis: KPIData[] }> => {
    const data = await analyticsService.getDashboard();
    return { kpis: adaptDashboardToKPIs(data) };
  },

  /** Derived — calls getDashboard and returns revenue / category arrays */
  getRevenue: async (): Promise<{
    weekly: WeeklyRevenue[];
    monthly: WeeklyRevenue[];
    byCategory: CategoryRevenue[];
  }> => {
    const data = await analyticsService.getDashboard();
    const weekly = adaptDailyToWeekly(data.sales_last_7_days);
    return { weekly, monthly: weekly, byCategory: [] };
  },

  /** Derived — calls getDashboard and returns top products */
  getTopProducts: async (): Promise<{ products: TopProduct[] }> => {
    const data = await analyticsService.getDashboard();
    return { products: adaptTopProducts(data.top_5_products) };
  },

  /** GET /analytics/financial */
  getFinancial: (params: { date_from: string; date_to: string }) => {
    const query = new URLSearchParams(params).toString();
    return apiClient.get<unknown>(`/analytics/financial?${query}`, 'admin');
  },

  /** GET /analytics/orders-by-status */
  getOrdersByStatus: () =>
    apiClient.get<unknown>('/analytics/orders-by-status', 'admin'),
};
