// ─────────────────────────────────────────────────────────
// ANALYTICS TYPES
// ─────────────────────────────────────────────────────────

export interface KPIData {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  trend: number;
  icon: string;
}

export interface WeeklyRevenue {
  week: string;
  revenue: number;
  orders: number;
}

export interface MonthlyRevenue {
  month: string;
  revenue: number;
  orders: number;
  customers: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number;
  percentage: number;
}

export interface TopProduct {
  id: string;
  name: string;
  revenue: number;
  units: number;
  image: string;
}

export interface AnalyticsDashboard {
  kpis: KPIData[];
  weeklyRevenue: WeeklyRevenue[];
  monthlyRevenue: MonthlyRevenue[];
  categoryRevenue: CategoryRevenue[];
  topProducts: TopProduct[];
}

// ─── Financial Analysis ───────────────────────────────────

export interface CostBreakdown {
  role: string;
  amount: number;
  color: string;
}

export interface PhaseActivityData {
  phase: string;
  hours: number;
  cost: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  hourlyRate: number;
  avatar: string;
  email: string;
}

export interface ProjectPhase {
  name: string;
  activities: ProjectActivity[];
}

export interface ProjectActivity {
  name: string;
  cost: number;
  hours: number;
  responsible: string;
}
