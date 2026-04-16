import { useCallback } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';
import { analyticsService } from '../services/analyticsService';

export function useAdminAnalytics() {
  const {
    kpis,
    weeklyRevenue,
    monthlyRevenue,
    categoryRevenue,
    topProducts,
    isLoading,
    error,
    setKPIs,
    setWeeklyRevenue,
    setMonthlyRevenue,
    setCategoryRevenue,
    setTopProducts,
    setLoading,
    setError,
  } = useAnalyticsStore();

  const fetchKPIs = useCallback(async () => {
    setLoading(true);
    try {
      const { kpis: data } = await analyticsService.getKPIs();
      setKPIs(data);
      return data;
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar KPIs';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setKPIs, setLoading, setError]);

  const fetchRevenue = useCallback(async () => {
    const { weekly, monthly, byCategory } = await analyticsService.getRevenue();
    setWeeklyRevenue(weekly);
    setMonthlyRevenue(monthly);
    setCategoryRevenue(byCategory);
  }, [setWeeklyRevenue, setMonthlyRevenue, setCategoryRevenue]);

  const fetchTopProducts = useCallback(async () => {
    const { products } = await analyticsService.getTopProducts();
    setTopProducts(products);
    return products;
  }, [setTopProducts]);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([fetchKPIs(), fetchRevenue(), fetchTopProducts()]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Error al cargar analíticas';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [fetchKPIs, fetchRevenue, fetchTopProducts, setLoading, setError]);

  return {
    kpis,
    weeklyRevenue,
    monthlyRevenue,
    categoryRevenue,
    topProducts,
    isLoading,
    error,
    fetchKPIs,
    fetchRevenue,
    fetchTopProducts,
    fetchAll,
  };
}
