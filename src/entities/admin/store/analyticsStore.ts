import { create } from 'zustand';
import type { KPIData, WeeklyRevenue, MonthlyRevenue, CategoryRevenue, TopProduct } from '../types/analytics.types';

interface AnalyticsState {
  kpis: KPIData[];
  weeklyRevenue: WeeklyRevenue[];
  monthlyRevenue: MonthlyRevenue[];
  categoryRevenue: CategoryRevenue[];
  topProducts: TopProduct[];
  isLoading: boolean;
  error: string | null;
  setKPIs: (kpis: KPIData[]) => void;
  setWeeklyRevenue: (data: WeeklyRevenue[]) => void;
  setMonthlyRevenue: (data: MonthlyRevenue[]) => void;
  setCategoryRevenue: (data: CategoryRevenue[]) => void;
  setTopProducts: (products: TopProduct[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAnalyticsStore = create<AnalyticsState>()((set) => ({
  kpis: [],
  weeklyRevenue: [],
  monthlyRevenue: [],
  categoryRevenue: [],
  topProducts: [],
  isLoading: false,
  error: null,

  setKPIs: (kpis) => set({ kpis }),
  setWeeklyRevenue: (weeklyRevenue) => set({ weeklyRevenue }),
  setMonthlyRevenue: (monthlyRevenue) => set({ monthlyRevenue }),
  setCategoryRevenue: (categoryRevenue) => set({ categoryRevenue }),
  setTopProducts: (topProducts) => set({ topProducts }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
