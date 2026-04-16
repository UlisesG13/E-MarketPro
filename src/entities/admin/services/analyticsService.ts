import { apiClient } from '../../../shared/services/apiClient';
import type { KPIData, WeeklyRevenue, MonthlyRevenue, CategoryRevenue, TopProduct } from '../types/analytics.types';

export interface AnalyticsKPIsResponse {
  kpis: KPIData[];
}

export interface AnalyticsRevenueResponse {
  weekly: WeeklyRevenue[];
  monthly: MonthlyRevenue[];
  byCategory: CategoryRevenue[];
}

export const analyticsService = {
  /**
   * Get KPI metrics for the dashboard.
   * GET /admin/analytics/kpis
   */
  getKPIs: (): Promise<AnalyticsKPIsResponse> =>
    apiClient.get<AnalyticsKPIsResponse>('/admin/analytics/kpis', 'admin'),

  /**
   * Get revenue data (weekly, monthly, by category).
   * GET /admin/analytics/revenue
   */
  getRevenue: (): Promise<AnalyticsRevenueResponse> =>
    apiClient.get<AnalyticsRevenueResponse>('/admin/analytics/revenue', 'admin'),

  /**
   * Get top performing products.
   * GET /admin/analytics/top-products
   */
  getTopProducts: (): Promise<{ products: TopProduct[] }> =>
    apiClient.get<{ products: TopProduct[] }>('/admin/analytics/top-products', 'admin'),
};
